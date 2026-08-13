export default function PrivacyPage() {
  return (
    <div className="w-full pb-24">
      <div className="mx-auto max-w-3xl mt-12">
        <div className="bg-brand-soft-pink/30 rounded-[2.5rem] p-12 text-center mb-8 border border-brand-rose/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-soft-pink via-brand-accent to-brand-soft-pink opacity-50" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">Privacy Policy</h1>
          <p className="text-sm font-bold tracking-widest uppercase text-brand-accent">
            Last updated: August 2026
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(244,164,164,0.3)] border border-brand-rose/20 space-y-12">
          
          <div>
            <h2 className="text-2xl font-black text-black mb-4">Introduction</h2>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              At ThreeKnots, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div>
            <h2 className="text-2xl font-black text-black mb-4">Information We Collect</h2>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              We may collect personal identification information from you in a variety of ways, including, but not limited to, when you visit our site, register on the site, place an order, subscribe to the newsletter, respond to a survey, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. You may be asked for, as appropriate, name, email address, mailing address, phone number, and credit card information.
            </p>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div>
            <h2 className="text-2xl font-black text-black mb-4">Use of Your Information</h2>
            <p className="text-lg text-gray-600 leading-relaxed px-4 mb-4">
              ThreeKnots may collect and use your personal information for the following purposes:
            </p>
            <ul className="list-none space-y-3 px-4">
              <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-brand-soft-pink/30 text-brand-accent flex items-center justify-center text-xs font-black">✓</span><span className="text-gray-600 font-medium">To improve customer service</span></li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-brand-soft-pink/30 text-brand-accent flex items-center justify-center text-xs font-black">✓</span><span className="text-gray-600 font-medium">To personalize user experience</span></li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-brand-soft-pink/30 text-brand-accent flex items-center justify-center text-xs font-black">✓</span><span className="text-gray-600 font-medium">To process payments</span></li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-brand-soft-pink/30 text-brand-accent flex items-center justify-center text-xs font-black">✓</span><span className="text-gray-600 font-medium">To run a promotion, contest, survey or other Site feature</span></li>
              <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-brand-soft-pink/30 text-brand-accent flex items-center justify-center text-xs font-black">✓</span><span className="text-gray-600 font-medium">To send periodic emails regarding your order or other products and services</span></li>
            </ul>
          </div>

          <div className="w-full h-px bg-brand-rose/20 my-8"></div>

          <div>
            <h2 className="text-2xl font-black text-black mb-4">Sharing Your Personal Information</h2>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
