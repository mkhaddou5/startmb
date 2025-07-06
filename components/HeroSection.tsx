export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 text-center bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-gray-800 mb-6">
        Sell Smarter. Pay Less. <br />
        <span className="text-blue-600">No Agents. Just Results.</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
        StartMB is the new way to sell your home — direct, fast, and with just a 3% flat closing fee. No commissions.
      </p>
      <a
        href="/auth"
        className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        Get Started
      </a>
    </section>
  )
}
