'use client'

export function PrintButton() {
  return (
    <div className="max-w-4xl mx-auto mt-6 text-center print:hidden">
      <button 
        onClick={() => window.print()}
        className="bg-black text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        Print Invoice
      </button>
    </div>
  )
}
