import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Camera, Code, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
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

const projects: Project[] = [
  {
    id: 1,
    titleKey: "portfolio.projects.product.title",
    category: "photography",
    descriptionKey: "portfolio.projects.product.description",
    tags: ["Product", "Commercial", "Lighting"],
    image: productPhoto,
  },
  {
    id: 2,
    titleKey: "portfolio.projects.portfolio.title",
    category: "coding",
    descriptionKey: "portfolio.projects.portfolio.description",
    tags: ["React", "TypeScript", "Tailwind"],
    image: portfolioWebsite,
  },
  {
    id: 3,
    titleKey: "portfolio.projects.street.title",
    category: "photography",
    descriptionKey: "portfolio.projects.street.description",
    tags: ["Street", "Documentary", "Urban"],
    image: streetPhoto,
  },
  {
    id: 4,
    titleKey: "portfolio.projects.ecommerce.title",
    category: "coding",
    descriptionKey: "portfolio.projects.ecommerce.description",
    tags: ["React", "E-Commerce", "Full-Stack"],
    image: ecommerceWebsite,
  },
  {
    id: 5,
    titleKey: "portfolio.projects.event.title",
    category: "photography",
    descriptionKey: "portfolio.projects.event.description",
    tags: ["Event", "Wedding", "Corporate"],
    image: eventPhoto,
  },
  {
    id: 6,
    titleKey: "portfolio.projects.mobile.title",
    category: "coding",
    descriptionKey: "portfolio.projects.mobile.description",
    tags: ["UI/UX", "Mobile", "Figma"],
    image: mobileApp,
  },
];

const Portfolio = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Project | null>(null);
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  const stackItems: (CardStackItem & { project: Project })[] = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        title: t(p.titleKey),
        description: t(p.descriptionKey),
        imageSrc: p.image,
        tag: p.tags[0],
        project: p,
      })),
    [t]
  );


  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className={`py-20 md:py-32 relative transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold">
              {t("portfolio.title")}{" "}
              <span className="text-primary">{t("portfolio.titleHighlight")}</span>
            </h2>
            <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              {t("portfolio.subtitle")}
            </p>
          </div>




          {/* Card Stack */}
          <div className="overflow-hidden">
            <CardStack
              key={activeCategory}
              items={stackItems}
              cardWidth={480}
              cardHeight={300}
              autoAdvance
              loop
              className="mx-auto max-w-full"
              onActivate={(item) => {
                const found = stackItems.find((s) => s.id === item.id);
                if (found) setSelected(found.project);
              }}
            />
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground md:text-sm">
            Drag atau klik kartu aktif untuk melihat detail
          </p>
        </div>
      </div>

      {/* Lightbox / detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border/50">
          {selected && (
            <>
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={selected.image}
                  alt={t(selected.titleKey)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl md:text-3xl">
                    {t(selected.titleKey)}
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    {t(selected.descriptionKey)}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Portfolio;
