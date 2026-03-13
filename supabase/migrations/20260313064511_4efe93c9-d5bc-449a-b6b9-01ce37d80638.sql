
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  thumbnail_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Anyone can read published articles" ON public.articles
  FOR SELECT USING (published = true);

-- Admin can do everything
CREATE POLICY "Admins can read all articles" ON public.articles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert articles" ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update articles" ON public.articles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete articles" ON public.articles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Storage bucket for thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('article-thumbnails', 'article-thumbnails', true);

CREATE POLICY "Anyone can view thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-thumbnails');

CREATE POLICY "Admins can upload thumbnails" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'article-thumbnails' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update thumbnails" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'article-thumbnails' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete thumbnails" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'article-thumbnails' AND public.has_role(auth.uid(), 'admin'));
