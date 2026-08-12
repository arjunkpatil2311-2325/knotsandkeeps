'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  try {
    // 1. Parse client data
    const cartItemsRaw = formData.get('cartItems') as string
    if (!cartItemsRaw) throw new Error("Cart is empty")
    const cartItems: { id: string, quantity: number }[] = JSON.parse(cartItemsRaw)
    
    if (cartItems.length === 0) throw new Error("Cart is empty")

    const customer_name = formData.get('customer_name') as string
    const customer_email = formData.get('customer_email') as string
    const customer_phone = formData.get('customer_phone') as string
    
    const shipping_address = formData.get('shipping_address') as string
    const shipping_address_2 = formData.get('shipping_address_2') as string
    const shipping_city = formData.get('shipping_city') as string
    const shipping_state = formData.get('shipping_state') as string
    const shipping_zip = formData.get('shipping_zip') as string
    const shipping_country = formData.get('shipping_country') as string || 'India'
    
    const sameAsShipping = formData.get('sameAsShipping') === 'true'
    const billing_address = sameAsShipping ? shipping_address : formData.get('billing_address') as string
    const billing_city = sameAsShipping ? shipping_city : formData.get('billing_city') as string
    const billing_state = sameAsShipping ? shipping_state : formData.get('billing_state') as string
    const billing_zip = sameAsShipping ? shipping_zip : formData.get('billing_zip') as string
    const billing_country = shipping_country

    const delivery_method = formData.get('deliveryMethod') as 'normal' | 'fast'
    const payment_method = formData.get('paymentMethod') as 'prepaid' | 'advance'

    // 2. Fetch fresh product data from DB to verify prices and stock
    const productIds = cartItems.map(item => item.id)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity')
      .in('id', productIds)

    if (productsError || !products) {
      throw new Error("Failed to verify products")
    }

    // 3. Calculate safe totals
    let subtotal = 0
    const orderItemsToInsert = []

    for (const item of cartItems) {
      const dbProduct = products.find(p => p.id === item.id)
      if (!dbProduct) {
        throw new Error(`Product unavailable`)
      }
      if (dbProduct.stock_quantity < item.quantity) {
        throw new Error(`Only ${dbProduct.stock_quantity} left for ${dbProduct.name}`)
      }
      
      subtotal += dbProduct.price * item.quantity
      
      orderItemsToInsert.push({
        product_id: dbProduct.id,
        product_name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity
      })
    }

    let delivery_charge = 0
    if (delivery_method === 'fast') {
      delivery_charge = 99
    } else if (subtotal < 499) {
      delivery_charge = 59
    }

    const total_discount = 0
    const total_amount = subtotal + delivery_charge - total_discount

    const amount_paid = 0
    const amount_remaining = payment_method === 'advance' ? Math.round(total_amount / 2) : total_amount

    // 4. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address: shipping_address + (shipping_address_2 ? `, ${shipping_address_2}` : ''),
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
        billing_address,
        billing_city,
        billing_state,
        billing_zip,
        billing_country,
        subtotal,
        total_discount,
        delivery_charge,
        total_amount,
        delivery_method,
        payment_method,
        amount_paid,
        amount_remaining,
        payment_status: 'pending',
        order_status: 'pending_payment', 
        payment_transaction_id: null
      })
      .select('id, order_number')
      .single()

    if (orderError || !order) {
      throw new Error(`Failed to create order: ${orderError?.message}`)
    }

    // 5. Insert Order Items
    const itemsWithOrderId = orderItemsToInsert.map(item => ({
      ...item,
      order_id: order.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId)

    if (itemsError) {
      throw new Error(`Failed to add items to order: ${itemsError.message}`)
    }

    // 6. Update Stock (Ideally this should be an RPC transaction, doing it sequentially for now)
    for (const item of cartItems) {
      const dbProduct = products.find(p => p.id === item.id)
      if (dbProduct) {
        await supabase
          .from('products')
          .update({ stock_quantity: dbProduct.stock_quantity - item.quantity })
          .eq('id', dbProduct.id)
      }
    }

    // 7. Insert Order History Event
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        status: 'pending_payment',
        notes: 'Order placed, awaiting payment.'
      })

    // Import and trigger Email notification for order creation
    const { sendOrderCreatedEmail } = await import('@/lib/notifications/email')
    
    // We need to fetch the full order data for the email (including items)
    const { data: fullOrder } = await supabase
      .from('orders')
      .select(`*, order_items(*)`)
      .eq('id', order.id)
      .single()
      
    if (fullOrder) {
      await sendOrderCreatedEmail(fullOrder)
    }
    
    // Trigger Admin Notification
    const { createAdminNotification } = await import('@/lib/notifications/admin')
    await createAdminNotification({
      type: 'new_order',
      title: 'New Order Received',
      message: `Order ${order.order_number} for ₹${total_amount} from ${customer_name}`,
      link_url: `/admin/orders/${order.order_number}`
    })

    revalidatePath('/admin/orders')
    
    return { success: true, orderNumber: order.order_number }

  } catch (error: any) {
    console.error("Order creation failed:", error)
    return { error: error.message || "Failed to process order" }
  }
}

