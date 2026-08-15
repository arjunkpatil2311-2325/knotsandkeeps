import { createClient } from '@/utils/supabase/server'
import { updateCategory } from '../../actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error: pageError } = await searchParams
  const supabase = await createClient()

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !category) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-black tracking-tight">Edit Category</h1>
        <p className="mt-1 text-sm text-black font-bold">Update product category details.</p>
      </div>

      {pageError && (
        <div className="mb-6 bg-red-100 border-2 border-black text-black px-4 py-3 rounded-lg relative font-bold" role="alert">
          <span className="block sm:inline">{pageError}</span>
        </div>
      )}

      <form action={updateCategory} className="space-y-8 divide-y-2 divide-black bg-white border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl p-6 sm:p-8">
        <input type="hidden" name="id" value={category.id} />
        
        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
            <label htmlFor="name" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Name <span className="text-red-600">*</span></label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input type="text" name="name" id="name" defaultValue={category.name} required className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black sm:max-w-xs" />
            </div>
          </div>
          
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
            <label htmlFor="slug" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Slug</label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input type="text" name="slug" id="slug" defaultValue={category.slug} className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black sm:max-w-xs" />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t-2 sm:border-black sm:pt-5">
            <label htmlFor="description" className="block text-sm font-black text-black uppercase tracking-wider sm:mt-px sm:pt-2">Description</label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <textarea name="description" id="description" rows={5} defaultValue={category.description || ''} className="max-w-lg block w-full bg-white border-2 border-black rounded-lg shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] p-2 font-bold text-black focus:ring-0 focus:border-black" />
            </div>
          </div>
        </div>

        <div className="pt-5 border-t-2 border-black mt-8">
          <div className="flex justify-end gap-3">
            <Link href="/admin/categories" className="bg-white border-2 border-black text-black px-4 py-2.5 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-neo-bg transition-all text-center">
              Cancel
            </Link>
            <button type="submit" className="bg-neo-yellow border-2 border-black text-black px-6 py-2.5 rounded-lg text-sm font-bold shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-yellow-400 transition-all">
              Save Category
            </button>
          </div>
        </div>
      </form>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', () => {
              const nameInput = document.getElementById('name');
              const slugInput = document.getElementById('slug');
              // Only auto-generate if slug is empty or matches the auto-generated format
              let userEditedSlug = false;
              if (slugInput) {
                slugInput.addEventListener('input', () => {
                   userEditedSlug = true;
                });
              }
              if(nameInput && slugInput) {
                nameInput.addEventListener('input', (e) => {
                  if(!userEditedSlug) {
                    slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  }
                });
              }
            });
          `
        }}
      />
    </div>
  )
}
