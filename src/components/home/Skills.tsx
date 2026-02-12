import { Camera, Code, Palette, Zap, Sparkles, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Skills = () => {
  const { t } = useTranslation();
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  
  const skillCategories = [
    {
      icon: Camera,
      title: t('skills.photography'),
      skills: ["Product Photography", "Street Photography", "Event Documentation", "Portrait", "Commercial"],
      color: "text-primary"
    },
    {
      icon: Code,
      title: t('skills.webDev'),
      skills: ["React & TypeScript", "Tailwind CSS", "Responsive Design", "UI/UX Implementation", "Modern Web Apps"],
      color: "text-accent"
    },
    {
      icon: Palette,
      title: t('skills.creativeDesign'),
      skills: ["Visual Design", "Brand Identity", "Layout Design", "Color Theory", "Typography"],
      color: "text-primary"
    },
    {
      icon: Sparkles,
      title: t('skills.aiIntegration'),
      skills: ["AI-Powered Tools", "Automation", "Creative AI", "Workflow Optimization", "Content Enhancement"],
      color: "text-accent"
    },
    {
      icon: Zap,
      title: t('skills.toolsTech'),
      skills: ["Figma", "Adobe Suite", "Git & GitHub", "VS Code", "Vercel/Netlify"],
      color: "text-primary"
    },
    {
      icon: Lightbulb,
      title: t('skills.softSkills'),
      skills: ["Problem Solving", "Creative Thinking", "Client Communication", "Project Management", "Attention to Detail"],
      color: "text-accent"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className={`py-20 bg-gradient-subtle relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-primary bg-clip-text text-transparent">
            {t('skills.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg px-2">
            {t('skills.subtitle')}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-primary/10 ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-sm hover:bg-primary/20 hover:text-primary transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
