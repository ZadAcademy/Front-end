"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useGetPostsInfiniteQuery } from '../hooks/use-posts-api';
import PostCard from './post-card';
import PostFormModal from './post-form-modal';
import { Post } from '../lib/types/posts-types';

export default function PostsFeed() {
  const t = useTranslations('Posts');
  const { data: session } = useSession();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useGetPostsInfiniteQuery({ pageSize: 10, isPublic: true });

  const permissions: string[] = (session?.user as any)?.permissions || [];
  const canCreate = permissions.includes('posts:create') || (session?.user as any)?.role === 'SuperAdmin';

  const handleCreate = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blueNormal gap-4">
        <Loader2 className="size-10 animate-spin" />
        <span className="font-cairo-bold-lg text-greyDark">{t('loading', { defaultValue: 'Loading posts...' })}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500 font-cairo-bold-lg">
        {t('error', { defaultValue: 'Failed to load posts. Please try again.' })}
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-cairo-bold-3xl text-greyDark">{t('title', { defaultValue: 'Community Posts' })}</h2>
        
        {canCreate && (
          <button
            onClick={handleCreate}
            className="bg-blueNormal text-white px-6 py-2.5 rounded-lg font-cairo-bold-base hover:bg-blueNormalHover transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="size-5" />
            {t('createNewPost', { defaultValue: 'Create Post' })}
          </button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-12 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blueNormal/10 text-blueNormal rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="font-cairo-bold-xl text-greyDark">{t('noPostsYet', { defaultValue: 'No Posts Yet' })}</h3>
          <p className="text-greyNormal font-cairo-medium-base">{t('beTheFirst', { defaultValue: 'Be the first to share something with the community!' })}</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="flex justify-center py-8 text-blueNormal">
              <Loader2 className="size-8 animate-spin" />
            </div>
          }
          endMessage={
            <div className="text-center py-8 text-greyNormal font-cairo-medium-base border-t border-black/5 mt-8">
              {t('endOfPosts', { defaultValue: 'You have seen all posts.' })}
            </div>
          }
          className="flex flex-col gap-6 !overflow-visible"
        >
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onEdit={handleEdit} 
            />
          ))}
        </InfiniteScroll>
      )}

      {isModalOpen && (
        <PostFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          postToEdit={editingPost}
        />
      )}
    </div>
  );
}
