import { createClient } from '@/utils/supabase/server'
import { CheckoutForm } from './CheckoutForm'
import { releaseExpiredReservations } from '@/utils/cleanup'

export default async function CheckoutPage() {
  const supabase = await createClient()
  
  // Lazily cleanup expired stock reservations
  await releaseExpiredReservations()
  
  const { data: settings } = await supabase
    .from('payment_settings')
    .select('*')
    .single()

  return <CheckoutForm settings={settings} />
}
