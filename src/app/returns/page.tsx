export default function ReturnsPage() {
  return (
    <div className="w-full pb-24">
      <div className="mx-auto max-w-3xl mt-12">
        <div className="bg-brand-soft-pink/30 rounded-[2.5rem] p-12 text-center mb-8 border border-brand-rose/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-soft-pink via-brand-accent to-brand-soft-pink opacity-50" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">Return Policy</h1>
          <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto">
            Information about returns, refunds, and damaged items.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(244,164,164,0.3)] border border-brand-rose/20 space-y-8">
          
          <div className="bg-brand-bg p-8 rounded-3xl border border-brand-rose/10">
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              We accept returns up to <span className="font-bold text-black">14 days after delivery</span>, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return.
            </p>
          </div>
          
          <div className="px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-xl text-brand-accent">💔</div>
              <h2 className="text-2xl font-black text-black m-0">Damaged Items</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              In the event that your order arrives damaged in any way, please email us as soon as possible at <a href="mailto:hello@threeknots.com" className="font-bold text-brand-accent hover:underline">hello@threeknots.com</a> with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.
            </p>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div className="px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-xl text-brand-accent">🎨</div>
              <h2 className="text-2xl font-black text-black m-0">Custom Orders</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Please note that custom orders are <span className="font-bold text-black">non-refundable</span> unless they arrive defective or damaged.
            </p>
          </div>

          <div className="mt-12 text-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-gray-600 font-medium">
              If you have any further questions, please don't hesitate to <a href="/contact" className="font-bold text-black hover:text-brand-accent transition-colors">contact us</a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
