import { createClient } from '@/utils/supabase/server'
import { CheckoutForm } from './CheckoutForm'

export default async function CheckoutPage() {
  const supabase = await createClient()
  
  const { data: settings } = await supabase
    .from('payment_settings')
    .select('*')
    .single()

  return <CheckoutForm settings={settings} />
}
