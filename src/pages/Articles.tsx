import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import { Calendar, ArrowRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('articles')
      .select('id, title, slug, excerpt, thumbnail_url, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setArticles(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Artikel" backTo="/" backLabel="Beranda" />

      <main className="container px-4 md:px-6 py-8">
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Memuat artikel...</p>
        ) : articles.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">Belum ada artikel yang dipublikasikan.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} to={`/articles/${article.slug}`}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {article.thumbnail_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.thumbnail_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <CardContent className="p-5 space-y-3">
                    <h2 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Articles;
