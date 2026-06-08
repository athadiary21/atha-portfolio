import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Portfolio from "@/components/home/Portfolio";
import Skills from "@/components/home/Skills";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";
import LanguageToggle from "@/components/common/LanguageToggle";
import SEO from "@/components/common/SEO";
import BackgroundFX from "@/components/common/BackgroundFX";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={t('home.title')}
        description={t('home.description')}
      />
      <BackgroundFX />
      <div className="relative z-10">
        <LanguageToggle />
        <Hero />
        <hr className="section-divider" />
        <About />
        <hr className="section-divider" />
        <Portfolio />
        <hr className="section-divider" />
        <Skills />
        <hr className="section-divider" />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
