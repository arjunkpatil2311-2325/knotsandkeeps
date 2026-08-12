import { createProduct } from '../actions'

export default function CreateProductPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create Product</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new bracelet to your store.</p>
      </div>

      <form action={createProduct} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          
          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
            </div>
            
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Product Name <span className="text-red-500">*</span></label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="text" name="name" id="name" required className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Slug (URL) <span className="text-red-500">*</span></label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="text" name="slug" id="slug" required className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md border p-2" placeholder="e.g. rengoku-flame-bracelet" />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Description</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea id="description" name="description" rows={5} className="max-w-lg shadow-sm block w-full focus:ring-black focus:border-black sm:text-sm border border-gray-300 rounded-md p-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Pricing & Inventory</h3>
            </div>
            
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Price (₹) <span className="text-red-500">*</span></label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="number" step="0.01" name="price" id="price" required className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="compare_at_price" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Original Price (₹)</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="number" step="0.01" name="compare_at_price" id="compare_at_price" className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md border p-2" placeholder="For discounts" />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Stock Quantity <span className="text-red-500">*</span></label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="number" name="stock_quantity" id="stock_quantity" required defaultValue={0} className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>
              </div>
              
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">SKU</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="text" name="sku" id="sku" className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Images</h3>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Product Images</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input type="file" name="images" id="images" multiple accept="image/*" className="max-w-lg block w-full shadow-sm focus:ring-black focus:border-black sm:max-w-xs sm:text-sm border-gray-300 rounded-md border p-2" />
                  <p className="mt-2 text-sm text-gray-500">First image will be used as the primary image.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Organization & Visibility</h3>
            </div>
            <div className="space-y-6 sm:space-y-5">
              
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Status</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select id="status" name="status" className="max-w-lg block focus:ring-black focus:border-black w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md border p-2">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Badges</label>
                <div className="mt-1 sm:mt-0 sm:col-span-2 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="is_featured" name="is_featured" type="checkbox" className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_featured" className="font-medium text-gray-700">Featured Product</label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="is_bestseller" name="is_bestseller" type="checkbox" className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_bestseller" className="font-medium text-gray-700">Bestseller</label>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="is_new_arrival" name="is_new_arrival" type="checkbox" className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_new_arrival" className="font-medium text-gray-700">New Arrival</label>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Cancel
            </button>
            <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Save Product
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
