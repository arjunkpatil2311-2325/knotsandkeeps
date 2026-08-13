export default function ShippingPage() {
  return (
    <div className="w-full pb-24">
      <div className="mx-auto max-w-3xl mt-12">
        <div className="bg-brand-soft-pink/30 rounded-[2.5rem] p-12 text-center mb-8 border border-brand-rose/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-soft-pink via-brand-accent to-brand-soft-pink opacity-50" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">Shipping Policy</h1>
          <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto">
            We are thrilled that you've chosen ThreeKnots! We work hard to get your hand-crafted pieces to you as quickly as possible.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(244,164,164,0.3)] border border-brand-rose/20 space-y-12">
          
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-xl text-brand-accent">⏱️</div>
              <h2 className="text-2xl font-black text-black m-0">Processing Time</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              All orders are processed within <span className="font-bold text-black">2 to 3 business days</span> (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
            </p>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-xl text-brand-accent">📦</div>
              <h2 className="text-2xl font-black text-black m-0">Domestic Shipping Rates</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              Shipping charges for your order will be calculated and displayed at checkout. Standard shipping typically takes <span className="font-bold text-black">3-7 business days</span> depending on your location within the country.
            </p>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-xl text-brand-accent">✈️</div>
              <h2 className="text-2xl font-black text-black m-0">International Shipping</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              At this time, we only ship domestically. We are looking into expanding our shipping options globally in the near future, so please stay tuned!
            </p>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-xl text-brand-accent">🔍</div>
              <h2 className="text-2xl font-black text-black m-0">Checking Order Status</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed px-4 bg-brand-bg p-6 rounded-2xl border border-brand-rose/10 mt-4">
              When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
