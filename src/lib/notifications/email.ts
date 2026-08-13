'use server'

import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const fromEmail = process.env.EMAIL_FROM || 'orders@threeknots.com'

function generateInvoiceHtml(order: any) {
  const itemsHtml = order.order_items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product_name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">ThreeKnots</h1>
        <p style="margin: 5px 0 0 0; color: #666;">Premium handcrafted bracelets</p>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h3 style="margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase;">Billed To:</h3>
          <p style="margin: 0;"><strong>${order.customer_name}</strong></p>
          <p style="margin: 0;">${order.billing_address}</p>
          <p style="margin: 0;">${order.billing_city}, ${order.billing_state} ${order.billing_zip}</p>
          <p style="margin: 0;">${order.customer_email}<br>${order.customer_phone}</p>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0 0 5px 0; font-size: 18px;">INVOICE</h2>
          <p style="margin: 0;"><strong>Order:</strong> #${order.order_number}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="width: 100%; max-width: 300px; margin-left: auto;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Subtotal:</span>
          <span>₹${order.subtotal.toFixed(2)}</span>
        </div>
        ${order.total_discount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #d32f2f;">
            <span>Discount:</span>
            <span>- ₹${order.total_discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">
          <span>Delivery Charge:</span>
          <span>₹${order.delivery_charge.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-weight: bold; font-size: 16px;">
          <span>Final Total:</span>
          <span>₹${order.total_amount.toFixed(2)}</span>
        </div>

        <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #666; font-size: 14px;">Payment Method:</span>
            <span style="font-size: 14px; text-transform: capitalize;">${order.payment_method === 'advance' ? '50% Advance' : '100% Prepaid'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #666; font-size: 14px;">Payment Status:</span>
            <span style="font-size: 14px; text-transform: capitalize;">${order.payment_status.replace('_', ' ')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #666; font-size: 14px;">Amount Paid:</span>
            <span style="font-size: 14px;">₹${order.amount_paid.toFixed(2)}</span>
          </div>
          ${order.amount_remaining > 0 ? `
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: #d32f2f; margin-top: 8px; border-top: 1px solid #ddd; padding-top: 8px;">
              <span>Balance Due:</span>
              <span>₹${order.amount_remaining.toFixed(2)}</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div style="margin-top: 40px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
        <p>Thank you for shopping with ThreeKnots!</p>
        <p>You can also download this invoice from your order tracking page.</p>
      </div>
    </div>
  `
}

export async function sendOrderCreatedEmail(order: any) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Skipping email.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #000;">Order Received!</h2>
        <p>Hi ${order.customer_name},</p>
        <p>Your order <strong>#${order.order_number}</strong> has been received and is currently awaiting payment verification.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Total Amount:</strong> ₹${order.total_amount.toFixed(2)}</p>
          <p style="margin: 0 0 10px 0;"><strong>Amount to Pay Now:</strong> ₹${order.amount_remaining.toFixed(2)}</p>
          <p style="margin: 0;"><strong>Payment Status:</strong> Payment Pending</p>
        </div>
        
        <p>Please complete your payment using the QR code displayed on your order confirmation page. Your order will be confirmed immediately after we verify your payment.</p>
        
        <p>Thank you,<br>ThreeKnots Team</p>
      </div>
    `

    const data = await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: `ThreeKnots — Order Received ${order.order_number}`,
      html: html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendOrderConfirmedEmail(order: any) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Skipping email.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const invoiceHtml = generateInvoiceHtml(order)
    const html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #000;">🎉 Your Order is Confirmed!</h2>
        <p>Hi ${order.customer_name},</p>
        <p>Your payment has been successfully verified and your order <strong>#${order.order_number}</strong> is now confirmed.</p>
        <p>We're preparing your order and it will be delivered as soon as possible. We'll keep you updated about your order status.</p>
        
        <div style="margin-top: 40px; padding-top: 40px; border-top: 1px solid #ddd;">
          ${invoiceHtml}
        </div>
      </div>
    `

    const data = await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: `🎉 ThreeKnots — Your Order is Confirmed ${order.order_number}`,
      html: html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendOrderStatusUpdateEmail(order: any, status: string, notes?: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Skipping email.')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    let subject = `ThreeKnots — Update on Order ${order.order_number}`
    let message = ''

    if (status === 'processing') {
      subject = `ThreeKnots — Order ${order.order_number} is Processing`
      message = 'Good news! Your order is now being processed and prepared.'
    } else if (status === 'packed') {
      subject = `ThreeKnots — Order ${order.order_number} is Packed`
      message = 'Your order has been carefully packed and is waiting for courier pickup.'
    } else if (status === 'shipped') {
      subject = `ThreeKnots — Order ${order.order_number} is Shipped`
      message = 'Your order is on its way! It has been shipped.'
      if (notes) {
        message += `<br><br><strong>Shipping Details:</strong><br>${notes}`
      }
    } else if (status === 'out_for_delivery') {
      subject = `ThreeKnots — Order ${order.order_number} is Out for Delivery`
      message = 'Your order is out for delivery today. Please keep your phone available.'
    } else if (status === 'delivered') {
      subject = `ThreeKnots — Order ${order.order_number} Delivered`
      message = 'Your order has been marked as delivered. We hope you love your new pieces!'
    } else {
      // Don't send emails for other statuses automatically
      return { success: true, skipped: true }
    }

    const html = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #000;">Order Update</h2>
        <p>Hi ${order.customer_name},</p>
        <p>${message}</p>
        <p>You can check your order status at any time on our website.</p>
        <p>Thank you,<br>ThreeKnots Team</p>
      </div>
    `

    const data = await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: subject,
      html: html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
