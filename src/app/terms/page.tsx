export default function TermsPage() {
  return (
    <div className="w-full pb-24">
      <div className="mx-auto max-w-3xl mt-12">
        <div className="bg-brand-soft-pink/30 rounded-[2.5rem] p-12 text-center mb-8 border border-brand-rose/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-soft-pink via-brand-accent to-brand-soft-pink opacity-50" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">Terms of Service</h1>
          <p className="text-sm font-bold tracking-widest uppercase text-brand-accent">
            Last updated: August 2026
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(244,164,164,0.3)] border border-brand-rose/20 space-y-12">
          
          <div>
            <h2 className="text-2xl font-black text-black mb-4">1. Acceptance of Terms</h2>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div>
            <h2 className="text-2xl font-black text-black mb-4">2. Intellectual Property</h2>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              The Site and its original content, features and functionality are owned by ThreeKnots and are protected by international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.
            </p>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div>
            <h2 className="text-2xl font-black text-black mb-4">3. Products and Services</h2>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
            </p>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div>
            <h2 className="text-2xl font-black text-black mb-4">4. Modifications to the Service and Prices</h2>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
