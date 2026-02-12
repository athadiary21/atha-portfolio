import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getFeaturedCourses } from "@/features/courses/data";
import CourseCard from "./courses/CourseCard";
import { Button } from "./ui/button";
import { COURSES_CONFIG } from "@/lib/constants";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Courses = () => {
  const { t } = useTranslation();
  const displayedCourses = getFeaturedCourses(COURSES_CONFIG.featuredCount);
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section 
      ref={sectionRef}
      id="courses" 
      className={`py-20 md:py-32 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold">
              {t('homeCourses.title')}{" "}
              <span className="text-primary">{t('homeCourses.titleHighlight')}</span>
            </h2>
            <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              {t('homeCourses.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {displayedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Button asChild size="lg">
              <Link to="/courses">{t('homeCourses.seeAll')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
