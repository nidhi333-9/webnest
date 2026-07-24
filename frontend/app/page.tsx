import { getAuthUser } from "@/lib/getAuthUser";
import CTA from "@/components/CTA";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import WebsitePreview from "@/components/WebsitePreview";

export default async function Home() {
  const authUser = await getAuthUser();

  return (
    <>
      <Navbar isLoggedIn={!!authUser} username={authUser?.username} />
      <Hero />
      <Features />
      <HowItWorks />
      <WebsitePreview />
      <CTA />
      <Footer />
    </>
  );
}
