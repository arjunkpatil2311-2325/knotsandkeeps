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
