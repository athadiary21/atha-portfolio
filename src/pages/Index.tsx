import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Portfolio from "@/components/home/Portfolio";
import Skills from "@/components/home/Skills";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";
import LanguageToggle from "@/components/common/LanguageToggle";
import SEO from "@/components/common/SEO";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={t('home.title')}
        description={t('home.description')}
      />
      <LanguageToggle />
      <Hero />
      <About />
      <Portfolio />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
