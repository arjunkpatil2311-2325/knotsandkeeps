import { createClient } from '@/utils/supabase/server'

export async function releaseExpiredReservations() {
  try {
    const supabase = await createClient()

    // Find all expired pending orders
    const { data: expiredOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_number')
      .eq('order_status', 'pending_payment')
      .eq('payment_status', 'pending')
      .lt('expires_at', new Date().toISOString())

    if (fetchError || !expiredOrders || expiredOrders.length === 0) {
      return
    }

    for (const order of expiredOrders) {
      // Fetch order items to restore stock
      const { data: items } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', order.id)

      if (items && items.length > 0) {
        // Safe stock restoration - we loop through and increase stock
        for (const item of items) {
          // Fetch current stock
          const { data: product } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single()

          if (product) {
            await supabase
              .from('products')
              .update({ stock_quantity: product.stock_quantity + item.quantity })
              .eq('id', item.product_id)
          }
        }
      }

      // Mark order as cancelled
      await supabase
        .from('orders')
        .update({
          order_status: 'cancelled',
          payment_status: 'failed'
        })
        .eq('id', order.id)

      // Add order history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: order.id,
          status: 'cancelled',
          notes: 'Pre-order expired after 30 minutes of no payment submission. Stock restored.'
        })
    }
  } catch (error) {
    console.error('Failed to run releaseExpiredReservations:', error)
  }
}
