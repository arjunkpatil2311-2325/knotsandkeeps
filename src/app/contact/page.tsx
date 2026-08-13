export default function ContactPage() {
  return (
    <div className="w-full pb-24">
      <div className="mx-auto max-w-3xl mt-12">
        <div className="bg-brand-soft-pink/30 rounded-[2.5rem] p-12 text-center mb-8 border border-brand-rose/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-soft-pink via-brand-accent to-brand-soft-pink opacity-50" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto">
            Have a question, custom request, or just want to say hi? We'd love to hear from you!
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(244,164,164,0.3)] border border-brand-rose/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-soft-pink/30 flex items-center justify-center text-xl text-brand-accent">👋</div>
            <h2 className="text-2xl font-black text-black">Get in Touch</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-bg p-8 rounded-3xl border border-brand-rose/10">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl mb-4 shadow-sm border border-brand-rose/20">✉️</div>
              <h3 className="font-bold text-lg text-black mb-2">Email</h3>
              <p className="text-brand-accent font-medium text-lg">hello@threeknots.com</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">We aim to respond within 24 hours.</p>
            </div>
            
            <div className="bg-brand-bg p-8 rounded-3xl border border-brand-rose/10">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl mb-4 shadow-sm border border-brand-rose/20">📱</div>
              <h3 className="font-bold text-lg text-black mb-2">Social Media</h3>
              <div className="space-y-2 mt-2">
                <p className="text-gray-600 font-medium flex items-center gap-2">
                  <span className="text-brand-accent">Instagram:</span> @threeknots
                </p>
                <p className="text-gray-600 font-medium flex items-center gap-2">
                  <span className="text-brand-accent">Twitter:</span> @threeknots
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
