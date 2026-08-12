import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function AdminSettingsPage() {
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

    const supabaseServer = await createClient()
    
    // Check if we need to update or insert (we have a row from migration, but just in case)
    const { data: existing } = await supabaseServer.from('payment_settings').select('id').single()
    
    if (existing) {
      await supabaseServer.from('payment_settings').update({
        payment_instructions,
        qr_image_url,
        is_100_percent_enabled,
        is_50_percent_enabled,
        updated_at: new Date().toISOString()
      }).eq('id', existing.id)
    } else {
      await supabaseServer.from('payment_settings').insert({
        payment_instructions,
        qr_image_url,
        is_100_percent_enabled,
        is_50_percent_enabled
      })
    }
    
    revalidatePath('/admin/settings')
    revalidatePath('/checkout')
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment Configuration</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure how customers pay for orders. These details are shown on the checkout and order status pages.
          </p>
        </div>
        
        <div className="p-6">
          <form action={updatePaymentSettings} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Payment Instructions</label>
                <div className="mt-1">
                  <textarea
                    name="payment_instructions"
                    rows={4}
                    defaultValue={settings?.payment_instructions || ''}
                    className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                    placeholder="E.g., Transfer to Bank Account / UPI ID..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Provide bank details, UPI ID, or general payment instructions.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">QR Code Image URL</label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="qr_image_url"
                    defaultValue={settings?.qr_image_url || ''}
                    className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="https://..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Provide a direct URL to your QR code image (upload to Supabase Storage and paste link here).</p>
                {settings?.qr_image_url && (
                  <div className="mt-3">
                    <img src={settings.qr_image_url} alt="QR Code Preview" className="h-32 w-32 object-contain border rounded bg-gray-50" />
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <fieldset>
                  <legend className="text-base font-medium text-gray-900">Allowed Payment Options</legend>
                  <div className="mt-4 space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="100_percent"
                          name="is_100_percent_enabled"
                          type="checkbox"
                          defaultChecked={settings?.is_100_percent_enabled}
                          className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="100_percent" className="font-medium text-gray-700">100% Full Payment</label>
                        <p className="text-gray-500">Allow customers to pay the full amount immediately.</p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="50_percent"
                          name="is_50_percent_enabled"
                          type="checkbox"
                          defaultChecked={settings?.is_50_percent_enabled}
                          className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="50_percent" className="font-medium text-gray-700">50% Advance Payment</label>
                        <p className="text-gray-500">Allow customers to pay 50% now and 50% later.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
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
