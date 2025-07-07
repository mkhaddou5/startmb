'use client';

export default function HowItWorks() {
  return (
    <section className="py-section bg-light text-dark">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold mb-6 text-center">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">1. Tell Us About Your Home</h3>
            <p className="text-secondary text-sm">
              Provide basic details about your property, including location, features, and images.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">2. List With Confidence</h3>
            <p className="text-secondary text-sm">
              We publish your listing to interested buyers — no agent fees, no commission.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">3. Close for a Flat 3%</h3>
            <p className="text-secondary text-sm">
              When your home sells, we handle the paperwork and charge only a simple flat 3% fee at closing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
