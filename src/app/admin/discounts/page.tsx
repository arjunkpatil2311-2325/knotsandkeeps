import { createClient } from '@/utils/supabase/server'
import { createDiscount, deleteDiscount } from './actions'
import { Trash2 } from 'lucide-react'

export default async function AdminDiscountsPage() {
  const supabase = await createClient()

  const { data: discounts, error } = await supabase
    .from('discounts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching discounts:", error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">Discounts</h1>
          <p className="mt-1 text-sm text-black font-bold">Manage discount codes and promotions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-[4px_4px_0_0_#000] rounded-xl border-2 border-black p-6">
            <h2 className="text-xl font-black text-black uppercase tracking-wider mb-4">Add New Discount</h2>
            <form action={createDiscount} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Code <span className="text-red-600">*</span></label>
                <input type="text" name="code" id="code" required className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black uppercase" placeholder="e.g. SUMMER20" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Type</label>
                  <select name="type" id="type" className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="value" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Value <span className="text-red-600">*</span></label>
                  <input type="number" step="0.01" name="value" id="value" required className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black" />
                </div>
              </div>

              <div>
                <label htmlFor="min_order_amount" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Min Order Amount (₹)</label>
                <input type="number" step="0.01" name="min_order_amount" id="min_order_amount" defaultValue={0} className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black" />
              </div>

              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input id="is_active" name="is_active" type="checkbox" defaultChecked className="focus:ring-0 h-5 w-5 text-black bg-white border-2 border-black rounded-sm" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="is_active" className="font-bold text-black">Active</label>
                  <p className="text-xs text-gray-500">Customers can use this code at checkout.</p>
                </div>
              </div>

              <button type="submit" className="w-full bg-neo-yellow border-2 border-black text-black px-4 py-2 rounded-lg font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all mt-4">
                Create Discount
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-transparent md:bg-white md:shadow-[4px_4px_0_0_#000] overflow-hidden md:rounded-xl md:border-2 border-black">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full block md:table border-collapse">
                <thead className="bg-neo-green border-y-2 border-black hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Code</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group space-y-4 md:space-y-0 divide-y-0 md:divide-y-2 md:divide-black">
                  {discounts && discounts.length > 0 ? (
                    discounts.map((discount) => (
                      <tr key={discount.id} className="block md:table-row hover:bg-neo-bg transition-colors bg-white border-2 border-black md:border-0 rounded-xl md:rounded-none p-4 md:p-0 shadow-[4px_4px_0_0_#000] md:shadow-none">
                        <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap border-b-2 border-dashed border-gray-300 md:border-none">
                          <span className="md:hidden font-bold uppercase text-xs text-gray-500">Code</span>
                          <span className="text-sm font-black text-black bg-yellow-200 px-2 py-1 rounded border-2 border-black">{discount.code}</span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-black font-bold">
                          <span className="md:hidden font-bold uppercase text-xs text-gray-500">Discount</span>
                          <div>
                            <span>{discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}</span>
                            {discount.min_order_amount > 0 && <span className="block text-xs text-gray-500">Min: ₹{discount.min_order_amount}</span>}
                          </div>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                          <span className="md:hidden font-bold uppercase text-xs text-gray-500">Status</span>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] ${discount.is_active ? 'bg-neo-green text-black' : 'bg-gray-200 text-black'}`}>
                            {discount.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="block md:table-cell px-0 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-t-2 border-dashed border-gray-300 md:border-none mt-2 md:mt-0">
                          <form action={deleteDiscount} className="w-full md:w-auto">
                            <input type="hidden" name="id" value={discount.id} />
                            <button type="submit" className="w-full md:w-auto flex justify-center items-center text-white bg-red-500 py-2 px-3 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-red-600 font-bold text-xs uppercase" onClick={(e) => { if(!confirm('Are you sure you want to delete this discount?')) e.preventDefault(); }}>
                              <Trash2 className="w-4 h-4 md:hidden mr-2" />
                              <span className="md:hidden">Delete</span>
                              <Trash2 className="w-4 h-4 hidden md:block" />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="block md:table-row">
                      <td colSpan={4} className="block md:table-cell px-6 py-12 text-center text-black text-sm font-black uppercase bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] md:border-none md:shadow-none md:bg-transparent">
                        No discounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
