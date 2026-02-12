import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Code, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import streetPhoto from "@/assets/portfolio/street-photography.jpg";
import productPhoto from "@/assets/portfolio/product-photography.jpg";
import portfolioWebsite from "@/assets/portfolio/portfolio-website.png";
import ecommerceWebsite from "@/assets/portfolio/ecommerce-website.jpg";
import eventPhoto from "@/assets/portfolio/event-photography.jpg";
import mobileApp from "@/assets/portfolio/mobile-app.jpg";

type Category = "all" | "photography" | "coding";

interface Project {
  id: number;
  titleKey: string;
  category: Category;
  descriptionKey: string;
  tags: string[];
  image: string;
}

const Portfolio = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  const categories = [
    { id: "all", label: t('portfolio.filterAll'), icon: Sparkles },
    { id: "photography", label: t('portfolio.filterPhoto'), icon: Camera },
    { id: "coding", label: t('portfolio.filterCode'), icon: Code },
  ];

  const projects: Project[] = [
    {
      id: 1,
      titleKey: "portfolio.projects.product.title",
      category: "photography",
      descriptionKey: "portfolio.projects.product.description",
      tags: ["Product", "Commercial", "Lighting"],
      image: productPhoto
    },
    {
      id: 2,
      titleKey: "portfolio.projects.portfolio.title",
      category: "coding",
      descriptionKey: "portfolio.projects.portfolio.description",
      tags: ["React", "TypeScript", "Tailwind"],
      image: portfolioWebsite
    },
    {
      id: 3,
      titleKey: "portfolio.projects.street.title",
      category: "photography",
      descriptionKey: "portfolio.projects.street.description",
      tags: ["Street", "Documentary", "Urban"],
      image: streetPhoto
    },
    {
      id: 4,
      titleKey: "portfolio.projects.ecommerce.title",
      category: "coding",
      descriptionKey: "portfolio.projects.ecommerce.description",
      tags: ["React", "E-Commerce", "Full-Stack"],
      image: ecommerceWebsite
    },
    {
      id: 5,
      titleKey: "portfolio.projects.event.title",
      category: "photography",
      descriptionKey: "portfolio.projects.event.description",
      tags: ["Event", "Wedding", "Corporate"],
      image: eventPhoto
    },
    {
      id: 6,
      titleKey: "portfolio.projects.mobile.title",
      category: "coding",
      descriptionKey: "portfolio.projects.mobile.description",
      tags: ["UI/UX", "Mobile", "Figma"],
      image: mobileApp
    },
  ];

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section 
      ref={sectionRef}
      id="portfolio" 
      className={`py-20 md:py-32 relative transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold">
              {t('portfolio.title')} <span className="text-primary">{t('portfolio.titleHighlight')}</span>
            </h2>
            <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              {t('portfolio.subtitle')}
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as Category)}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-1.5 md:gap-2 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-card text-muted-foreground hover:bg-card/80 border border-border"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project) => {
              const title = t(project.titleKey);
              return (
                <Card 
                  key={project.id}
                  className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Project Image (clickable) */}
                  <div className="aspect-video relative overflow-hidden">
                    <a
                      href={project.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('portfolio.openInNewTab', { title })}
                      className="block w-full h-full"
                      title={title}
                    >
                      <img 
                        src={project.image} 
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t(project.descriptionKey)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
