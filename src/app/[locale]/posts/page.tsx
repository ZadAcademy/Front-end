import { setRequestLocale } from 'next-intl/server';
import PostsFeed from '@/features/posts/components/posts-feed';
import AuthNavbar from '@/shared/components/auth-navbar';

export default async function PostsPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <>
      <AuthNavbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8 animate-in fade-in duration-500">
        <PostsFeed />
      </main>
    </>
  );
}
