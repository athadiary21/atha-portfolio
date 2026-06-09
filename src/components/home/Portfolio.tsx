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

// Bento span pattern based on position so layout stays balanced under filtering.
const bentoSpan = (index: number) => {
  if (index === 0) return "md:col-span-2 lg:row-span-2";
  if (index === 3) return "lg:col-span-2";
  return "";
};

interface TiltCardProps {
  project: Project;
  spanClass: string;
  onOpen: (p: Project) => void;
}

const TiltCard = ({ project, spanClass, onOpen }: TiltCardProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const max = 6;
    setTransform(
      `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) scale(1.02)`
    );
  };

  const handleMouseLeave = () => setTransform("");

  const title = t(project.titleKey);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
      className={`group relative cursor-pointer ${spanClass}`}
      style={{ transform, transition: "transform 0.25s ease-out" }}
    >
      <Card className="relative h-full min-h-[220px] overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-shadow duration-300 group-hover:shadow-glow">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />

        {/* Glow ring on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/0 group-hover:ring-primary/40 transition-all duration-300" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-end p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] md:text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <h3 className="font-display text-lg md:text-2xl font-bold leading-tight">
                {title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm mt-1 max-h-0 overflow-hidden opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500">
                {t(project.descriptionKey)}
              </p>
            </div>
            <span className="shrink-0 w-9 h-9 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Portfolio = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  const categories = [
    { id: "all", label: t("portfolio.filterAll"), icon: Sparkles },
    { id: "photography", label: t("portfolio.filterPhoto"), icon: Camera },
    { id: "coding", label: t("portfolio.filterCode"), icon: Code },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

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

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[220px] md:auto-rows-[240px] gap-4 md:gap-6">
            {filteredProjects.map((project, index) => (
              <TiltCard
                key={project.id}
                project={project}
                spanClass={bentoSpan(index)}
                onOpen={setSelected}
              />
            ))}
          </div>
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
