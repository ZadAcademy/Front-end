"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Image as ImageIcon
} from 'lucide-react';
import { Post } from '../lib/types/posts-types';
import { useDeletePostMutation, useTogglePostVisibilityMutation } from '../hooks/use-posts-api';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
}

export default function PostCard({ post, onEdit }: PostCardProps) {
  const t = useTranslations('Posts');
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const deleteMutation = useDeletePostMutation();
  const toggleVisibilityMutation = useTogglePostVisibilityMutation();

  // Assuming session.user.permissions exists, fallback to checking role or just allowing it if session exists
  // In a real app, this should strictly check session.user.permissions?.includes('posts:update')
  const permissions: string[] = (session?.user as any)?.permissions || [];
  const canUpdate = permissions.includes('posts:update') || (session?.user as any)?.role === 'SuperAdmin';
  const canDelete = permissions.includes('posts:delete') || (session?.user as any)?.role === 'SuperAdmin';
  
  const hasActions = canUpdate || canDelete;

  const handleDelete = () => {
    if (confirm(t('confirmDelete', { defaultValue: 'Are you sure you want to delete this post?' }))) {
      deleteMutation.mutate(post.id, {
        onSuccess: () => {
          toast.success(t('deleteSuccess', { defaultValue: 'Post deleted successfully' }));
          setIsMenuOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || t('deleteFailed', { defaultValue: 'Failed to delete post' }));
        }
      });
    }
  };

  const handleToggleVisibility = () => {
    toggleVisibilityMutation.mutate(post.id, {
      onSuccess: () => {
        toast.success(t('visibilitySuccess', { defaultValue: 'Visibility toggled successfully' }));
        setIsMenuOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || t('visibilityFailed', { defaultValue: 'Failed to toggle visibility' }));
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 flex flex-col hover:shadow-md transition-shadow p-4 sm:p-5">
      
      {/* ─── Header: Author Info & Actions ─── */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blueNormal/10 flex items-center justify-center text-blueNormal font-cairo-bold-base">
            {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-cairo-bold-base text-greyDarker leading-tight">
              {post.authorName || 'User'}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-cairo-medium-sm text-greyNormal mt-0.5">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              {!post.isPublic && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-orange-600 font-cairo-bold-sm bg-orange-50 px-1.5 py-0.5 rounded">
                    <EyeOff className="size-3" />
                    <span>{t('private', { defaultValue: 'Private' })}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {hasActions && (
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-gray-400 hover:text-blueNormal hover:bg-blueNormal/10 rounded-full transition-colors"
            >
              <MoreVertical className="size-5" />
            </button>
            
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute rtl:left-0 ltr:right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-black/5 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                  {canUpdate && (
                    <>
                      <button
                        onClick={() => {
                          onEdit(post);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-start px-4 py-2 text-sm font-cairo-medium-sm text-greyDark hover:bg-black/5 transition-colors flex items-center gap-2"
                      >
                        <Edit className="size-4 text-blueNormal" />
                        {t('edit', { defaultValue: 'Edit Post' })}
                      </button>
                      <button
                        onClick={handleToggleVisibility}
                        className="w-full text-start px-4 py-2 text-sm font-cairo-medium-sm text-greyDark hover:bg-black/5 transition-colors flex items-center gap-2"
                      >
                        {post.isPublic ? (
                          <>
                            <EyeOff className="size-4 text-orange-500" />
                            {t('makePrivate', { defaultValue: 'Make Private' })}
                          </>
                        ) : (
                          <>
                            <Eye className="size-4 text-green-500" />
                            {t('makePublic', { defaultValue: 'Make Public' })}
                          </>
                        )}
                      </button>
                    </>
                  )}
                  {canUpdate && canDelete && <div className="h-px bg-black/5 my-1" />}
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full text-start px-4 py-2 text-sm font-cairo-medium-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="size-4" />
                      {t('delete', { defaultValue: 'Delete Post' })}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ─── Content: Title & Text ─── */}
      <div className="mb-4">
        <h3 className="font-cairo-bold-lg text-greyDarker mb-1.5 leading-tight">
          {post.title}
        </h3>
        <p className="font-cairo-medium-base text-greyDark whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* ─── Image (if provided) ─── */}
      {post.imageUrl && (
        <div className="w-full rounded-xl overflow-hidden bg-gray-50 border border-black/5">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-auto object-contain max-h-[500px]"
          />
        </div>
      )}
    </div>
  );
}
