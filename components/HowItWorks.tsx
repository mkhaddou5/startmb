export default function HowItWorks() {
  const steps = [
    { step: '1', title: 'Sign Up', desc: 'Create your free StartMB account in seconds.' },
    { step: '2', title: 'Create Your Listing', desc: 'Fill out property details and photos — we’ll review it fast.' },
    { step: '3', title: 'Go Live', desc: 'Your listing is published and buyers can contact you directly.' },
    { step: '4', title: 'Pay 3% at Close', desc: 'No agents. Just a flat fee once your property sells.' },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {steps.map(({ step, title, desc }) => (
          <div key={step} className="p-6 border rounded-lg shadow hover:shadow-md transition">
            <div className="text-4xl font-bold text-blue-600 mb-2">{step}</div>
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
