import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { deleteProduct } from './actions'

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch products with their primary image
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (url)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-black text-black tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-black font-bold">
            A list of all the products in your store including their name, price, stock, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/products/create"
            className="inline-flex items-center justify-center rounded-lg border-2 border-black bg-neo-yellow px-4 py-2.5 text-sm font-bold text-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-yellow-400 transition-all sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5 font-bold" aria-hidden="true" />
            Create Product
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden md:shadow-[4px_4px_0_0_#000] md:rounded-xl md:border-2 border-black md:bg-white">
              <table className="min-w-full block md:table border-collapse">
                <thead className="bg-neo-blue border-y-2 border-black hidden md:table-header-group">
                  <tr>
                    <th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-black text-black uppercase tracking-wider sm:pl-6">Product</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Stock</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-black text-black uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group space-y-4 md:space-y-0 p-4 md:p-0 bg-gray-50 md:bg-white divide-y-0 md:divide-y-2 md:divide-black">
                  {products?.map((product) => (
                    <tr key={product.id} className="block md:table-row hover:bg-neo-bg transition-colors bg-white border-2 border-black md:border-0 rounded-xl md:rounded-none p-4 md:p-0 shadow-[4px_4px_0_0_#000] md:shadow-none mb-4 md:mb-0">
                      <td className="block md:table-cell whitespace-nowrap py-4 md:pl-4 md:pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-16 w-16 md:h-12 md:w-12 flex-shrink-0 relative bg-white rounded-lg overflow-hidden border-2 border-black">
                            {product.product_images?.[0]?.url ? (
                              <img className="h-full w-full object-cover" src={product.product_images[0].url} alt="" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[10px] text-black uppercase font-bold text-center">No Img</div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-black text-black text-lg md:text-sm">{product.name}</div>
                            <div className="text-black font-bold text-sm md:text-xs mt-0.5">{product.sku || 'No SKU'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="flex justify-between md:table-cell whitespace-nowrap px-0 md:px-3 py-2 md:py-4 text-sm text-black border-t-2 border-dashed border-gray-300 md:border-none mt-4 md:mt-0 pt-4 md:pt-4">
                        <span className="md:hidden font-bold uppercase text-xs text-gray-500">Price</span>
                        <div className="text-right md:text-left">
                          <div className="font-black text-black text-lg md:text-sm">₹{product.price}</div>
                          {product.compare_at_price && (
                            <div className="text-xs text-black/60 font-bold line-through">₹{product.compare_at_price}</div>
                          )}
                        </div>
                      </td>
                      <td className="flex justify-between items-center md:table-cell whitespace-nowrap px-0 md:px-3 py-2 md:py-4 text-sm">
                        <span className="md:hidden font-bold uppercase text-xs text-gray-500">Stock</span>
                        <div>
                          {product.stock_quantity === 0 ? (
                            <span className="inline-flex rounded-lg bg-neo-pink px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_#000] text-xs font-bold leading-5 text-black">Out of Stock</span>
                          ) : product.stock_quantity <= 5 ? (
                            <span className="inline-flex rounded-lg bg-neo-yellow px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_#000] text-xs font-bold leading-5 text-black">Low Stock ({product.stock_quantity})</span>
                          ) : (
                            <span className="inline-flex rounded-lg bg-neo-green px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_#000] text-xs font-bold leading-5 text-black">In Stock ({product.stock_quantity})</span>
                          )}
                        </div>
                      </td>
                      <td className="flex justify-between items-center md:table-cell whitespace-nowrap px-0 md:px-3 py-2 md:py-4 text-sm">
                        <span className="md:hidden font-bold uppercase text-xs text-gray-500">Status</span>
                        <div>
                          <span className={`inline-flex rounded-lg px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_#000] text-xs font-bold leading-5 capitalize text-black
                            ${product.status === 'published' ? 'bg-neo-green' : 'bg-white'}`}>
                            {product.status}
                          </span>
                        </div>
                      </td>
                      <td className="block md:table-cell relative whitespace-nowrap py-4 px-0 md:pl-3 md:pr-4 text-right text-sm font-medium sm:pr-6 border-t-2 border-black md:border-none mt-2 md:mt-0">
                        <div className="flex justify-end gap-3 w-full">
                          <Link href={`/admin/products/edit/${product.id}`} className="flex-1 md:flex-none flex justify-center items-center text-black bg-neo-blue py-2 px-4 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-blue-400 transition-all font-bold text-xs uppercase">
                            <Edit className="h-4 w-4 mr-2 md:hidden" />
                            Edit
                          </Link>
                          <form action={deleteProduct} className="flex-1 md:flex-none">
                            <input type="hidden" name="id" value={product.id} />
                            <button type="submit" className="w-full flex justify-center items-center text-black bg-neo-pink py-2 px-4 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-pink-400 transition-all font-bold text-xs uppercase">
                              <Trash2 className="h-4 w-4 mr-2 md:hidden" />
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!products || products.length === 0) && (
                    <tr className="block md:table-row">
                      <td colSpan={5} className="block md:table-cell whitespace-nowrap px-3 py-12 text-sm text-black uppercase text-center font-black bg-white rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000] md:border-none md:shadow-none md:bg-transparent">
                        No products found.
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
