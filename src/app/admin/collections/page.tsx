import { createClient } from '@/utils/supabase/server'
import { createCollection, deleteCollection } from './actions'
import { Trash2 } from 'lucide-react'

export default async function AdminCollectionsPage() {
  const supabase = await createClient()

  const { data: collections, error } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching collections:", error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">Collections</h1>
          <p className="mt-1 text-sm text-black font-bold">Manage curated collections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-[4px_4px_0_0_#000] rounded-xl border-2 border-black p-6">
            <h2 className="text-xl font-black text-black uppercase tracking-wider mb-4">Add New Collection</h2>
            <form action={createCollection} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Name <span className="text-red-600">*</span></label>
                <input type="text" name="name" id="name" required className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black" />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Slug <span className="text-red-600">*</span></label>
                <input type="text" name="slug" id="slug" required className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black" placeholder="e.g. summer-vibes" />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Description</label>
                <textarea name="description" id="description" rows={3} className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black" />
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Collection Image</label>
                <input type="file" name="image" id="image" accept="image/*" className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black file:mr-4 file:py-1 file:px-3 file:rounded file:border-2 file:border-black file:text-xs file:font-bold file:bg-neo-blue file:text-black hover:file:bg-blue-400 file:shadow-[1px_1px_0_0_#000] file:active:translate-x-[1px] file:active:translate-y-[1px] file:active:shadow-none file:transition-all cursor-pointer" />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Status</label>
                <select name="status" id="status" className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-neo-yellow border-2 border-black text-black px-4 py-2 rounded-lg font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                Create Collection
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-transparent md:bg-white md:shadow-[4px_4px_0_0_#000] overflow-hidden md:rounded-xl md:border-2 border-black">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full block md:table border-collapse">
                <thead className="bg-neo-blue border-y-2 border-black hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Collection</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group space-y-4 md:space-y-0 divide-y-0 md:divide-y-2 md:divide-black">
                  {collections && collections.length > 0 ? (
                    collections.map((collection) => (
                      <tr key={collection.id} className="block md:table-row hover:bg-neo-bg transition-colors bg-white border-2 border-black md:border-0 rounded-xl md:rounded-none p-4 md:p-0 shadow-[4px_4px_0_0_#000] md:shadow-none">
                        <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap border-b-2 border-dashed border-gray-300 md:border-none">
                          <span className="md:hidden font-bold uppercase text-xs text-gray-500">Collection</span>
                          <div className="flex items-center">
                            {collection.image_url ? (
                              <img src={collection.image_url} alt="" className="h-10 w-10 rounded-lg border-2 border-black object-cover mr-3 shadow-[1px_1px_0_0_#000] hidden md:block" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg border-2 border-black bg-gray-200 mr-3 hidden md:block"></div>
                            )}
                            <div>
                              <p className="text-sm font-black text-black">{collection.name}</p>
                              <p className="text-xs text-gray-600 font-bold hidden md:block">{collection.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                          <span className="md:hidden font-bold uppercase text-xs text-gray-500">Status</span>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] ${collection.status === 'active' ? 'bg-neo-green text-black' : 'bg-gray-200 text-black'}`}>
                            {collection.status}
                          </span>
                        </td>
                        <td className="block md:table-cell px-0 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-t-2 border-dashed border-gray-300 md:border-none mt-2 md:mt-0">
                          <form action={deleteCollection} className="w-full md:w-auto">
                            <input type="hidden" name="id" value={collection.id} />
                            <button type="submit" className="w-full md:w-auto flex justify-center items-center text-white bg-red-500 py-2 px-3 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-red-600 font-bold text-xs uppercase" onClick={(e) => { if(!confirm('Are you sure you want to delete this collection? Products in this collection will have their collection removed.')) e.preventDefault(); }}>
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
                      <td colSpan={3} className="block md:table-cell px-6 py-12 text-center text-black text-sm font-black uppercase bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] md:border-none md:shadow-none md:bg-transparent">
                        No collections found.
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
