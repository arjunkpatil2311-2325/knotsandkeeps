'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function submitPaymentVerification(orderId: string, orderNumber: string, utr: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 1. Verify Ownership
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('user_id, payment_status')
    .eq('id', orderId)
    .single()

  if (orderError || !order || order.user_id !== user.id) {
    return { error: 'Invalid order' }
  }

  if (order.payment_status !== 'pending' && order.payment_status !== 'failed') {
    return { error: 'Order payment is already submitted or verified.' }
  }

  // 2. Update Order
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      payment_transaction_id: utr,
      payment_status: 'verification_required',
      order_status: 'verification_required'
    })
    .eq('id', orderId)

  if (updateError) {
    return { error: 'Failed to save UTR. Please try again.' }
  }

  // 3. Log History
  await supabase
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status: 'verification_required',
      notes: `Customer submitted UTR: ${utr} for verification.`
    })

  // 4. Redirect
  redirect(`/order-confirmed/${orderNumber}`)
}

export async function cancelPreorder(orderId: string, orderNumber: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 1. Verify Ownership & Status
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('user_id, payment_status, order_status, payment_transaction_id')
    .eq('id', orderId)
    .single()

  if (orderError || !order || order.user_id !== user.id) {
    return { error: 'Invalid order' }
  }

  if (order.payment_status !== 'pending' || order.order_status !== 'pending_payment') {
    if (order.order_status === 'cancelled') {
      return { error: 'This pre-order has already been cancelled.' }
    }
    return { error: 'Payment details have already been submitted for verification, so this pre-order can no longer be cancelled here.' }
  }
  
  if (order.payment_transaction_id) {
    return { error: 'Payment details have already been submitted for verification, so this pre-order can no longer be cancelled here.' }
  }

  // 2. Restore Stock Safely
  const { data: items } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId)

  if (items && items.length > 0) {
    for (const item of items) {
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

  // 3. Mark Order Cancelled
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      order_status: 'cancelled',
      payment_status: 'failed'
    })
    .eq('id', orderId)

  if (updateError) {
    return { error: 'Failed to cancel order.' }
  }

  // 4. Log History
  await supabase
    .from('order_status_history')
    .insert({
      order_id: orderId,
      status: 'cancelled',
      notes: 'Customer cancelled pending pre-order before payment submission. Stock restored.'
    })

  return { success: true }
}
