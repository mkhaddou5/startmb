export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen text-center">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-2xl font-bold">StartMB</h1>
        <nav className="space-x-4">
          <a href="#how-it-works" className="text-sm hover:underline">How It Works</a>
          <a href="#contact" className="text-sm hover:underline">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Sell Your Home, Save More</h2>
        <p className="text-lg text-gray-600 mb-6">
          We replace traditional agents with a smarter platform. Flat 3% fee — no surprises.
        </p>
		<a
			href="/add"
			className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
		Get Started
		</a>
       
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <h3 className="text-2xl font-bold mb-10">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div>
            <h4 className="font-semibold mb-2">1. Submit Your Home</h4>
            <p className="text-sm text-gray-600">Tell us about your property in minutes.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">2. Flat 3% Listing</h4>
            <p className="text-sm text-gray-600">We list your home with full marketing power — no hidden fees.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">3. Close with Confidence</h4>
            <p className="text-sm text-gray-600">We manage the process through closing day.</p>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section id="contact" className="py-20 bg-gray-100">
        <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
        <p className="text-sm text-gray-600 mb-6">
          Leave your email and we will contact you shortly.
        </p>
        <form className="flex flex-col items-center gap-4 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full border px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:opacity-90"
          >
            Request Info
          </button>
        </form>
      </section>
    </main>
  );
}
