import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import { Plus, Edit, Trash2, Eye, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const AdminArticles = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchArticles();
  }, [isAdmin]);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, published, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (!error && data) setArticles(data);
    setFetching(false);
  };

  const deleteArticle = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      toast({ title: 'Gagal menghapus', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Artikel dihapus' });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header title="Kelola Artikel" backTo="/" backLabel="Beranda">
        <Link to="/admin/articles/new">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Buat Artikel
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
          <LogOut className="w-4 h-4" /> Keluar
        </Button>
      </Header>

      <main className="container px-4 md:px-6 py-8">
        {fetching ? (
          <p className="text-muted-foreground text-center py-12">Memuat...</p>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-muted-foreground">Belum ada artikel.</p>
            <Link to="/admin/articles/new">
              <Button className="gap-2"><Plus className="w-4 h-4" /> Buat Artikel Pertama</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{article.title}</h3>
                      <Badge variant={article.published ? 'default' : 'secondary'}>
                        {article.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground truncate">{article.excerpt}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(article.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {article.published && (
                      <Link to={`/articles/${article.slug}`}>
                        <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                      </Link>
                    )}
                    <Link to={`/admin/articles/edit/${article.id}`}>
                      <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => deleteArticle(article.id, article.title)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminArticles;
