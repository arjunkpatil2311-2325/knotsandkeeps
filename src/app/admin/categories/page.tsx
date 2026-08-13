import { createClient } from '@/utils/supabase/server'
import { createCategory, deleteCategory } from './actions'
import { Trash2, Edit2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string, success?: string }>
}) {
  const supabase = await createClient()
  const { error: pageError, success } = await searchParams

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*, products:products(count)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching categories:", error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-black font-bold">Manage product categories.</p>
        </div>
      </div>

      {pageError && (
        <div className="mb-6 bg-red-100 border-2 border-black text-black px-4 py-3 rounded-lg relative font-bold" role="alert">
          <span className="block sm:inline">{pageError}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-100 border-2 border-black text-black px-4 py-3 rounded-lg relative font-bold" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-[4px_4px_0_0_#000] rounded-xl border-2 border-black p-6">
            <h2 className="text-xl font-black text-black uppercase tracking-wider mb-4">Add New Category</h2>
            <form action={createCategory} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Name <span className="text-red-600">*</span></label>
                <input type="text" name="name" id="name" required className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black" />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Slug <span className="text-red-600">*</span></label>
                <input type="text" name="slug" id="slug" required className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black" placeholder="e.g. demon-slayer" />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-black text-black uppercase tracking-wider mb-1">Description</label>
                <textarea name="description" id="description" rows={3} className="block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black" />
              </div>

              <button type="submit" className="w-full bg-neo-yellow border-2 border-black text-black px-4 py-2 rounded-lg font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                Create Category
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-transparent md:bg-white md:shadow-[4px_4px_0_0_#000] overflow-hidden md:rounded-xl md:border-2 border-black">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full block md:table border-collapse">
                <thead className="bg-neo-pink border-y-2 border-black hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Products</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group space-y-4 md:space-y-0 divide-y-0 md:divide-y-2 md:divide-black">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <tr key={category.id} className="block md:table-row hover:bg-neo-bg transition-colors bg-white border-2 border-black md:border-0 rounded-xl md:rounded-none p-4 md:p-0 shadow-[4px_4px_0_0_#000] md:shadow-none">
                        <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap border-b-2 border-dashed border-gray-300 md:border-none">
                          <span className="md:hidden font-bold uppercase text-xs text-gray-500">Name</span>
                          <div>
                            <p className="text-sm font-black text-black">{category.name}</p>
                            {category.description && <p className="text-xs text-gray-600 font-bold hidden md:block">{category.description}</p>}
                          </div>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-black font-bold border-b-2 border-dashed border-gray-300 md:border-none">
                          <span className="md:hidden font-bold uppercase text-xs text-gray-500">Slug</span>
                          <span>{category.slug}</span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-0 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-black font-bold">
                          <span className="md:hidden font-bold uppercase text-xs text-gray-500">Products</span>
                          <span>{category.products[0]?.count || 0}</span>
                        </td>
                        <td className="block md:table-cell px-0 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-t-2 border-dashed border-gray-300 md:border-none mt-2 md:mt-0">
                          <div className="flex flex-col md:flex-row justify-end items-stretch gap-2 w-full md:w-auto">
                            <Link href={`/admin/categories/edit/${category.id}`} className="w-full md:w-auto flex justify-center items-center text-black bg-neo-blue py-2 px-3 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-blue-400 font-bold text-xs uppercase">
                              <Edit2 className="w-4 h-4 md:hidden mr-2" />
                              <span className="md:hidden">Edit</span>
                              <Edit2 className="w-4 h-4 hidden md:block" />
                            </Link>
                            <form action={deleteCategory} className="w-full md:w-auto">
                              <input type="hidden" name="id" value={category.id} />
                              <button type="submit" className="w-full md:w-auto flex justify-center items-center text-white bg-red-500 py-2 px-3 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-red-600 font-bold text-xs uppercase" onClick={(e) => { if(!confirm('Are you sure you want to delete this category? Products in this category will have their category removed.')) e.preventDefault(); }}>
                                <Trash2 className="w-4 h-4 md:hidden mr-2" />
                                <span className="md:hidden">Delete</span>
                                <Trash2 className="w-4 h-4 hidden md:block" />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="block md:table-row">
                      <td colSpan={4} className="block md:table-cell px-6 py-12 text-center text-black text-sm font-black uppercase bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] md:border-none md:shadow-none md:bg-transparent">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', () => {
              const nameInput = document.getElementById('name');
              const slugInput = document.getElementById('slug');
              if(nameInput && slugInput) {
                nameInput.addEventListener('input', (e) => {
                  slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                });
              }
            });
          `
        }}
      />
    </div>
  )
}
