export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-2xl font-bold">StartMB</div>
        <ul className="flex gap-6 text-sm font-medium">
          <li><a href="#how-it-works" className="hover:text-blue-600">How It Works</a></li>
          <li><a href="#pricing" className="hover:text-blue-600">Pricing</a></li>
          <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
          <li><a href="#login" className="hover:text-blue-600">Login</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-4 bg-gray-100">
        <h1 className="text-4xl font-extrabold mb-4">Skip the Realtor, Save Thousands.</h1>
        <p className="text-lg text-gray-700 mb-8">
          StartMB makes selling your home simple, fast, and only 3% at closing.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">Tell us about your home</h3>
            <p className="text-gray-600">Share some basic info to get started.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Get matched with a local pro</h3>
            <p className="text-gray-600">We’ll connect you with a vetted expert.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Close with confidence</h3>
            <p className="text-gray-600">Enjoy a smooth process and keep more money.</p>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="bg-blue-50 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Want to see how much you can save?</h2>
          <form className="grid gap-4">
            <input type="text" placeholder="Your Name" className="p-3 rounded border border-gray-300" />
            <input type="email" placeholder="Email Address" className="p-3 rounded border border-gray-300" />
            <input type="text" placeholder="Home Zip Code" className="p-3 rounded border border-gray-300" />
            <button type="submit" className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
              Get My Estimate
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
