import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

const ArticleView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          navigate('/articles');
          return;
        }
        setArticle(data);
        setLoading(false);
      });
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Memuat artikel...</p>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header title={article.title} backTo="/articles" backLabel="Semua Artikel" />

      <main className="container px-4 md:px-6 py-8 max-w-3xl mx-auto">
        {article.thumbnail_url && (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full rounded-xl mb-8 border border-border"
          />
        )}

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Calendar className="w-4 h-4" />
          {new Date(article.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </div>

        <article
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-foreground prose-p:text-muted-foreground
            prose-a:text-primary prose-strong:text-foreground
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-muted prose-pre:border prose-pre:border-border
            prose-img:rounded-lg prose-img:border prose-img:border-border"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ArticleView;
