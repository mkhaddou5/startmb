import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import HowItWorks from '../../components/HowItWorks';
import HomeSearch from '../../components/HomeSearch'; // ✅ make sure this import is correct
import ListingGrid from '../../components/ListingGrid';
import LeadCaptureForm from '../../components/LeadCaptureForm';
import Footer from '../../components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <HomeSearch /> {/* Inserted below HowItWorks */}
      <ListingGrid />
      <LeadCaptureForm />
      <Footer />
    </main>
  );
}
