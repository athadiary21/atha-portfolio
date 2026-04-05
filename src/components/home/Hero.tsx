import { Button } from "@/components/ui/button";
import { ArrowDown, Mail, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useTranslation } from "react-i18next";
import heroImage1 from "@/assets/hero-bg.jpg";
import heroImage2 from "@/assets/hero-bg-2.jpg";
import heroImage3 from "@/assets/hero-bg-3.jpg";
import heroImage4 from "@/assets/hero-bg-4.jpg";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 bg-gradient-subtle">
        <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="absolute inset-0">
          <CarouselContent className="h-screen">
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="relative h-screen">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">{t('hero.badge')}</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            {t('hero.name')}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium">
            {t('hero.tagline')}
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground/80 max-w-xl">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button variant="hero" size="lg" onClick={() => scrollToSection('portfolio')} className="text-base bg-slate-900 hover:bg-slate-800">
              {t('hero.viewWork')}
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="hero" size="lg" onClick={() => scrollToSection('contact')} className="text-base bg-slate-900 hover:bg-slate-800">
              {t('hero.contactMe')}
              <Mail className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="hero" size="lg" onClick={() => navigate('/articles')} className="text-base bg-slate-900 hover:bg-slate-800">
              Artikel   📰
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default Hero;
