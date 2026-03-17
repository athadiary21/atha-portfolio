import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import { Save, Upload, Eye, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ArticleEditor = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate('/admin/login');
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isEdit && isAdmin) {
      supabase.from('articles').select('*').eq('id', id).single().then(({ data, error }) => {
        if (error || !data) {
          toast({ title: 'Artikel tidak ditemukan', variant: 'destructive' });
          navigate('/admin/articles');
          return;
        }
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
        setExcerpt(data.excerpt || '');
        setPublished(data.published);
        setThumbnailUrl(data.thumbnail_url || '');
      });
    }
  }, [id, isEdit, isAdmin]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) setSlug(generateSlug(val));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('article-thumbnails').upload(path, file);
    if (error) {
      toast({ title: 'Gagal upload gambar', description: error.message, variant: 'destructive' });
    } else {
      const { data: urlData } = supabase.storage.from('article-thumbnails').getPublicUrl(path);
      setThumbnailUrl(urlData.publicUrl);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: 'Judul dan slug wajib diisi', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const articleData = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      thumbnail_url: thumbnailUrl || null,
      published,
      author_id: user!.id,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from('articles').update(articleData).eq('id', id));
    } else {
      ({ error } = await supabase.from('articles').insert(articleData));
    }

    if (error) {
      toast({ title: 'Gagal menyimpan', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: isEdit ? 'Artikel diperbarui!' : 'Artikel dibuat!' });
      navigate('/admin/articles');
    }
    setSaving(false);
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={isEdit ? 'Edit Artikel' : 'Buat Artikel Baru'}
        backTo="/admin/articles"
        backLabel="Kembali"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="published" className="text-sm">Publish</Label>
            <Switch id="published" checked={published} onCheckedChange={setPublished} />
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </Header>

      <main className="container px-4 md:px-6 py-8 max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Judul Artikel</Label>
          <Input
            id="title"
            placeholder="Masukkan judul artikel..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            placeholder="judul-artikel"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Ringkasan</Label>
          <Textarea
            id="excerpt"
            placeholder="Ringkasan singkat artikel..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Thumbnail</Label>
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="Thumbnail" className="w-full max-w-md rounded-lg border border-border" />
          )}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <span>
                  {uploading ? 'Mengupload...' : <><Upload className="w-4 h-4" /> Upload Gambar</>}
                </span>
              </Button>
            </label>
            {thumbnailUrl && (
              <Button variant="ghost" size="sm" onClick={() => setThumbnailUrl('')}>
                Hapus
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Konten Artikel</Label>
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="edit" className="gap-2">
                <Pencil className="w-4 h-4" /> Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="w-4 h-4" /> Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <Textarea
                id="content"
                placeholder="Tulis konten artikel di sini... Mendukung HTML"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="min-h-[400px] border border-border rounded-lg p-6 bg-card">
                {content ? (
                  <article className="prose prose-lg dark:prose-invert max-w-none">
                    {title && <h1>{title}</h1>}
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  </article>
                ) : (
                  <p className="text-muted-foreground text-center py-12">
                    Belum ada konten untuk di-preview
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
