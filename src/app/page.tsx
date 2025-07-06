import Navbar from '../../components/Navbar'
import HeroSection from '../../components/HeroSection'
import HowItWorks from '../../components/HowItWorks'
import LeadCaptureForm from '../../components/LeadCaptureForm'
import Footer from '../../components/Footer'
import ListingGrid from '../../components/ListingGrid'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <ListingGrid />
      <LeadCaptureForm />
      <Footer />
    </main>
  )
}
