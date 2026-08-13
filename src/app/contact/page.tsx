export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8 text-center">Contact Us</h1>
        <div className="prose prose-lg prose-gray mx-auto text-center">
          <p className="text-gray-600 mb-6">
            Have a question, custom request, or just want to say hi? We'd love to hear from you!
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 mt-12 text-left shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Email</h3>
                <p className="text-gray-600">hello@threeknots.com</p>
                <p className="text-sm text-gray-500 mt-1">We aim to respond within 24 hours.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Social Media</h3>
                <p className="text-gray-600">Instagram: @threeknots</p>
                <p className="text-gray-600">Twitter: @threeknots</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
