import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-5 border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Atha Rasyid. {t('footer.copyright')}
            </p>
            <p>Made in Indonesian (+62)</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="/articles" className="hover:text-foreground transition-colors">Artikel</a>
              <a href="/courses" className="hover:text-foreground transition-colors">Courses</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
