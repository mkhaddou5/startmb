import Navbar from '../../components/Navbar'
import HeroSection from '../../components/HeroSection'
import HowItWorks from '../../components/HowItWorks'
import LeadCaptureForm from '../../components/LeadCaptureForm'
import Footer from '../../components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <LeadCaptureForm />
      <Footer />
    </main>
  )
}
