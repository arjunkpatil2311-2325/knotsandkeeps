export default function FAQPage() {
  return (
    <div className="w-full pb-24">
      <div className="mx-auto max-w-3xl mt-12">
        <div className="bg-brand-soft-pink/30 rounded-[2.5rem] p-12 text-center mb-8 border border-brand-rose/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-soft-pink via-brand-accent to-brand-soft-pink opacity-50" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto">
            Everything you need to know about ThreeKnots products and services.
          </p>
        </div>

        <div className="space-y-6">
          
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(244,164,164,0.2)] border border-brand-rose/20 hover:border-brand-accent/30 transition-colors">
            <h2 className="text-xl font-black text-black mb-3 flex items-start gap-3">
              <span className="text-brand-accent shrink-0 mt-0.5">Q.</span>
              How long does shipping take?
            </h2>
            <p className="text-gray-600 font-medium pl-8">
              Orders are typically processed within 2-3 business days. Depending on your location, shipping can take an additional 3-7 business days. Custom pieces may take longer.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(244,164,164,0.2)] border border-brand-rose/20 hover:border-brand-accent/30 transition-colors">
            <h2 className="text-xl font-black text-black mb-3 flex items-start gap-3">
              <span className="text-brand-accent shrink-0 mt-0.5">Q.</span>
              Are the bracelets waterproof?
            </h2>
            <p className="text-gray-600 font-medium pl-8">
              Our standard nylon and paracord bracelets are highly water-resistant and can be worn in the shower or pool. However, prolonged exposure to harsh chemicals (like chlorine) may cause slight fading over time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(244,164,164,0.2)] border border-brand-rose/20 hover:border-brand-accent/30 transition-colors">
            <h2 className="text-xl font-black text-black mb-3 flex items-start gap-3">
              <span className="text-brand-accent shrink-0 mt-0.5">Q.</span>
              Do you take custom orders?
            </h2>
            <p className="text-gray-600 font-medium pl-8">
              Yes! If you have a specific color combination, theme, or character in mind, feel free to contact us through our Contact page or DM us on Instagram. We'd love to craft something unique for you.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(244,164,164,0.2)] border border-brand-rose/20 hover:border-brand-accent/30 transition-colors">
            <h2 className="text-xl font-black text-black mb-3 flex items-start gap-3">
              <span className="text-brand-accent shrink-0 mt-0.5">Q.</span>
              What happens if my bracelet breaks?
            </h2>
            <p className="text-gray-600 font-medium pl-8">
              We stand by our "made to keep" philosophy. If your bracelet breaks due to a manufacturing defect within 30 days, we'll replace it for free.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
