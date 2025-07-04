// src/app/page.js

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans">
      {/* Navigation */}
      <header className="w-full px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">StartMB</h1>
        <nav className="space-x-6">
          <a href="#how" className="hover:underline">How It Works</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gray-100">
        <h2 className="text-4xl font-bold mb-4">Sell Your Home, Save More</h2>
        <p className="text-lg mb-6">We replace traditional agents with a smarter platform. Flat 3% fee — no surprises.</p>
        <a href="#contact" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
          Get Started
        </a>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-6 bg-white text-center">
        <h3 className="text-3xl font-semibold mb-10">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <h4 className="text-xl font-semibold mb-2">1. Submit Your Home</h4>
            <p>Tell us about your property in minutes.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">2. Flat 3% Listing</h4>
            <p>We list your home with full marketing power — no hidden fees.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">3. Close with Confidence</h4>
            <p>We manage the process through closing day.</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-6 bg-gray-100 text-center">
        <h3 className="text-3xl font-semibold mb-6">Ready to Get Started?</h3>
        <p className="mb-6">Leave your email and we’ll contact you shortly.</p>
        <form className="max-w-md mx-auto">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mb-4 px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Request Info
          </button>
        </form>
      </section>
    </main>
  );
}
