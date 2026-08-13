export default function ShippingPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8 text-center">Shipping Policy</h1>
        <div className="prose prose-lg prose-gray mx-auto">
          <p className="text-gray-600 mb-6">
            We are thrilled that you've chosen ThreeKnots! We work hard to get your hand-crafted pieces to you as quickly as possible.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Processing Time</h2>
          <p className="text-gray-600 mb-6">
            All orders are processed within 2 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Domestic Shipping Rates and Estimates</h2>
          <p className="text-gray-600 mb-6">
            Shipping charges for your order will be calculated and displayed at checkout. Standard shipping typically takes 3-7 business days depending on your location within the country.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">International Shipping</h2>
          <p className="text-gray-600 mb-6">
            At this time, we only ship domestically. We are looking into expanding our shipping options globally in the near future, so please stay tuned!
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">How do I check the status of my order?</h2>
          <p className="text-gray-600 mb-6">
            When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
          </p>
        </div>
      </div>
    </div>
  )
}
