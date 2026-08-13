import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error } = await searchParams
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('payment_settings')
    .select('*')
    .single()

  async function updatePaymentSettings(formData: FormData) {
    'use server'
    const payment_instructions = formData.get('payment_instructions') as string
    const qr_image_url = formData.get('qr_image_url') as string
    const is_100_percent_enabled = formData.get('is_100_percent_enabled') === 'on'
    const is_50_percent_enabled = formData.get('is_50_percent_enabled') === 'on'

    const normal_delivery_charge = parseFloat(formData.get('delivery_normal_charge') as string) || 0
    const free_delivery_threshold = parseFloat(formData.get('delivery_free_threshold') as string) || null
    const fast_delivery_charge = parseFloat(formData.get('delivery_fast_charge') as string) || 0

    try {
      const supabaseServer = await createClient()
      
      // Check if we need to update or insert
      const { data: existing } = await supabaseServer.from('payment_settings').select('id').single()
      
      let dbError;
      if (existing) {
        const { error } = await supabaseServer.from('payment_settings').update({
          payment_instructions,
          qr_image_url,
          is_100_percent_enabled,
          is_50_percent_enabled,
          normal_delivery_charge,
          free_delivery_threshold,
          fast_delivery_charge,
          updated_at: new Date().toISOString()
        }).eq('id', existing.id)
        dbError = error
      } else {
        const { error } = await supabaseServer.from('payment_settings').insert({
          payment_instructions,
          qr_image_url,
          is_100_percent_enabled,
          is_50_percent_enabled,
          normal_delivery_charge,
          free_delivery_threshold,
          fast_delivery_charge
        })
        dbError = error
      }

      if (dbError) {
        throw new Error(dbError.message)
      }

      revalidatePath('/admin/settings')
      revalidatePath('/checkout')
      redirect('/admin/settings?success=true')
    } catch (err: any) {
      if (err && err.digest && err.digest.startsWith('NEXT_REDIRECT')) {
        throw err
      }
      console.error('Error updating settings:', err)
      redirect(`/admin/settings?error=${encodeURIComponent(err.message || 'Failed to save settings')}`)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-black text-black tracking-tight mb-6">Settings</h1>

      {success && (
        <div className="mb-6 bg-green-100 border-2 border-black text-black px-4 py-3 rounded-lg relative font-bold" role="alert">
          <span className="block sm:inline">Settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-100 border-2 border-black text-black px-4 py-3 rounded-lg relative font-bold" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl">
        <div className="px-6 py-5 border-b-2 border-black">
          <h2 className="text-xl font-black text-black uppercase tracking-wider">Payment Configuration</h2>
          <p className="mt-1 text-sm text-black font-bold">
            Configure how customers pay for orders. These details are shown on the checkout and order status pages.
          </p>
        </div>
        
        <div className="p-6">
          <form action={updatePaymentSettings} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-black text-black uppercase tracking-wider">Payment Instructions</label>
                <div className="mt-1">
                  <textarea
                    name="payment_instructions"
                    rows={4}
                    defaultValue={settings?.payment_instructions || ''}
                    className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-3 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50"
                    placeholder="E.g., Transfer to Bank Account / UPI ID..."
                  />
                </div>
                <p className="mt-2 text-sm text-black font-bold">Provide bank details, UPI ID, or general payment instructions.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-black text-black uppercase tracking-wider">QR Code Image URL</label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="qr_image_url"
                    defaultValue={settings?.qr_image_url || ''}
                    className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-3 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50"
                    placeholder="https://..."
                  />
                </div>
                <p className="mt-2 text-sm text-black font-bold">Provide a direct URL to your QR code image (upload to Supabase Storage and paste link here).</p>
                {settings?.qr_image_url && (
                  <div className="mt-3">
                    <img src={settings.qr_image_url} alt="QR Code Preview" className="h-32 w-32 object-contain border-2 border-black rounded-lg bg-white p-2 shadow-[4px_4px_0_0_#000]" />
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <fieldset>
                  <legend className="text-base font-black text-black uppercase tracking-wider">Allowed Payment Options</legend>
                  <div className="mt-4 space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="100_percent"
                          name="is_100_percent_enabled"
                          type="checkbox"
                          defaultChecked={settings?.is_100_percent_enabled}
                          className="focus:ring-0 h-5 w-5 text-black bg-white border-2 border-black rounded-sm"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="100_percent" className="font-black text-black">100% Full Payment</label>
                        <p className="text-black font-bold">Allow customers to pay the full amount immediately.</p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="50_percent"
                          name="is_50_percent_enabled"
                          type="checkbox"
                          defaultChecked={settings?.is_50_percent_enabled}
                          className="focus:ring-0 h-5 w-5 text-black bg-white border-2 border-black rounded-sm"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="50_percent" className="font-black text-black">50% Advance Payment</label>
                        <p className="text-black font-bold">Allow customers to pay 50% now and 50% later.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="sm:col-span-2 pt-6 border-t-2 border-black">
                <h3 className="text-lg font-black text-black uppercase tracking-wider mb-4">Delivery Settings</h3>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                  <div>
                    <label className="block text-sm font-black text-black uppercase tracking-wider">Normal Charge (₹)</label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="delivery_normal_charge"
                        defaultValue={settings?.normal_delivery_charge ?? 100}
                        className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-3 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-black uppercase tracking-wider">Free Threshold (₹)</label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="delivery_free_threshold"
                        defaultValue={settings?.free_delivery_threshold ?? ''}
                        className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-3 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50"
                        placeholder="Leave blank for no free tier"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-black uppercase tracking-wider">Fast Charge (₹)</label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="delivery_fast_charge"
                        defaultValue={settings?.fast_delivery_charge ?? 250}
                        className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-3 font-bold text-black focus:ring-0 focus:border-black placeholder-black/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-5 border-t-2 border-black mt-6">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-neo-yellow border-2 border-black text-black px-6 py-2.5 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-yellow-400 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
