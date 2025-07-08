'use client';

export default function HeroSection() {
  return (
 //   <section className="py-section bg-light text-center">
<section className="pt-28 pb-16 bg-light text-center"> {/* Increased top padding, reduced bottom */}   
   <div className="max-w-screen-xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-dark font-bold mb-4">
          Sell Smarter. Pay Less.
        </h1>
			    <p className="text-primary text-3xl md:text-4xl font-semibold mb-4">
		  Let StartMB AI (Artificial Intelligence) Handle the Work.
        </p>

        <p className="text-primary text-2xl md:text-3xl font-semibold mb-4">
          No Agents. No Commissions. 
		  </p>
	

        <p className="text-secondary max-w-2xl mx-auto text-base md:text-lg mb-2">
           StartMB <strong>(Start Modern Brokerage)</strong> — a tech-first, agentless platform that helps buyers and sellers come together and close deals quickly and easily with the power of AI.
</p>
  <p className="text-secondary max-w-2xl mx-auto text-base md:text-lg mb-2">
          Sell your home directly, skip the pressure, and keep more of your money — all for a simple flat fee.
        </p>
      </div>
    </section>
  );
}
