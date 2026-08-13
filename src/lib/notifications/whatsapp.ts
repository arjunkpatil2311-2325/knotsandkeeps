import { createClient } from '@/utils/supabase/server'

type NotificationEvent = 
  | 'created' 
  | 'verification_submitted' 
  | 'payment_verified' 
  | 'packed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered'

export async function sendOrderNotificationWhatsApp(orderNumber: string, event: NotificationEvent) {
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
  const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

  const supabase = await createClient()
  const { data: order } = await supabase
    .from('orders')
    .select(`*, order_items (product_name, quantity)`)
    .eq('order_number', orderNumber)
    .single()

  if (!order || !order.customer_phone) return false

  let messageBody = ''

  switch (event) {
    case 'created':
      messageBody = `Hi ${order.customer_name}! 👋\n\nYour ThreeKnots order ${order.order_number} has been created.\n\nOrder amount: ₹${order.total_amount.toFixed(2)}\nPayment required: ₹${order.amount_remaining.toFixed(2)}\n\nPlease complete the payment using the payment instructions on your order page.\n\nYour order will be confirmed after payment verification.\n\nThank you for shopping with ThreeKnots! 💝`
      break
    case 'verification_submitted':
      messageBody = `Hi ${order.customer_name}! 👋\n\nWe've received your payment confirmation for order ${order.order_number}.\n\nWe're verifying your payment now.\n\nWe'll notify you once your order is confirmed. 💝`
      break
    case 'payment_verified':
      const itemsList = order.order_items.map((i: any) => `${i.product_name} × ${i.quantity}`).join('\n')
      messageBody = `🎉 Your ThreeKnots order ${order.order_number} is confirmed!\n\nProduct:\n${itemsList}\n\nTotal:\n₹${order.total_amount.toFixed(2)}\n\nAmount paid:\n₹${order.amount_paid.toFixed(2)}\n\nRemaining:\n₹${order.amount_remaining.toFixed(2)}\n\nDelivery:\n${order.delivery_method} Delivery\n\nEstimated delivery:\n${order.delivery_method === 'fast' ? '3-5 days' : '7-9 days'}\n\nThank you for shopping with ThreeKnots! 💝`
      break
    case 'packed':
      messageBody = `📦 Your ThreeKnots order ${order.order_number} has been packed and is getting ready to ship!`
      break
    case 'shipped':
      messageBody = `🚚 Your ThreeKnots order ${order.order_number} has been shipped!\n\nCourier:\n${order.courier_name || 'N/A'}\n\nTracking number:\n${order.tracking_number || 'N/A'}\n\nTracking:\n${order.tracking_url || 'N/A'}`
      break
    case 'out_for_delivery':
      messageBody = `🏠 Your ThreeKnots order ${order.order_number} is out for delivery today!`
      break
    case 'delivered':
      messageBody = `💝 Your ThreeKnots order ${order.order_number} has been delivered!\n\nThank you for shopping with ThreeKnots!`
      break
  }

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn(`⚠️ WhatsApp boundary: Credentials missing. Skipping WhatsApp message to ${order.customer_phone}.`)
    console.log(`\n=================================\n[MOCK WHATSAPP MESSAGE]\nTo: ${order.customer_phone}\n\n${messageBody}\n=================================\n`)
    return true
  }

  // Real WhatsApp API POST request logic here
  throw new Error("Real WhatsApp integration not implemented yet.")
}
