import { Check, Github, Linkedin, Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import profileImage from "@/assets/profile.jpg";

const About = () => {
  const { t } = useTranslation();
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/athadiary21",
      label: "GitHub"
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/atha-rasyid-b1b5a0390/",
      label: "LinkedIn"
    },
    {
      icon: Instagram,
      href: "https://instagram.com/athadiary21",
      label: "Instagram"
    }
  ];

  const mainSkills = [
    t('about.skill1'),
    t('about.skill2'),
    t('about.skill3')
  ];

  const certificates = [
    t('about.cert1'),
    t('about.cert2'),
    t('about.cert3')
  ];

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className={`py-20 md:py-32 relative transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Social Sidebar - Desktop */}
          <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md aspect-[3/4] group">
                <img
                  src={profileImage}
                  alt="Atha Rasyid"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10" />
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <p className="text-muted-foreground text-lg">
                  {t('about.subtitle')}
                </p>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {t('about.yearsExperience')}{" "}
                  <span className="text-primary">{t('about.experience')}</span>{" "}
                  {t('about.asCreative')}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('about.description')}
                </p>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="skills" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    {t('about.mainSkills')}
                  </TabsTrigger>
                  <TabsTrigger value="certificates">
                    {t('about.certificates')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="skills" className="mt-6 space-y-4 animate-fade-in">
                  {mainSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <Check className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <span className="text-lg">{skill}</span>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="certificates" className="mt-6 space-y-4 animate-fade-in">
                  {certificates.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <Check className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <span className="text-lg">{cert}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              {/* Portfolio Button */}
              <div>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 gap-2"
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('about.portfolioButton')} →
                </Button>
              </div>
            </div>
          </div>

          {/* Social Links - Mobile */}
          <div className="flex lg:hidden justify-center gap-4 mt-12">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;