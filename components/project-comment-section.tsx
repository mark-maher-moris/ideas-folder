'use client';

import { useState } from 'react';
import { Project, Comment } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProjectCommentSectionProps {
  project: Project;
  onCommentsUpdated?: () => void;
}

export function ProjectCommentSection({ project, onCommentsUpdated }: ProjectCommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  
  // Mock authentication state for now
  const isSignedIn = true;
  const userId = 'user-' + Math.random().toString(36).substring(2, 9);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        author: authorName || 'Anonymous User',
        content: newComment.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Update Firestore
      const projectRef = doc(db, 'projects', project.id);
      await updateDoc(projectRef, {
        comments: arrayUnion({
          ...comment,
          createdAt: Timestamp.fromDate(comment.createdAt),
          updatedAt: Timestamp.fromDate(comment.updatedAt)
        }),
      });

      // Clear the input
      setNewComment('');
      setAuthorName('');
      
      // Notify parent component if needed
      if (onCommentsUpdated) {
        onCommentsUpdated();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to safely format dates
  const formatDate = (date: any) => {
    if (!date) return 'some time ago';
    
    try {
      // Handle Firebase Timestamp objects
      if (typeof date.toDate === 'function') {
        return formatDistanceToNow(date.toDate(), { addSuffix: true });
      }
      
      // Handle Date objects
      if (date instanceof Date) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      
      // Handle string dates
      if (typeof date === 'string') {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
      }
      
      return 'some time ago';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'some time ago';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      <div className="space-y-4 mb-6">
        {project.comments && project.comments.length > 0 ? (
          project.comments.map((comment) => (
            <div key={comment.id} className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{comment.author}</p>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      <form onSubmit={handleAddComment} className="space-y-2">
        <input
          type="text"
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full p-2 border rounded-md mb-2"
        />
        <Textarea
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || !newComment.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Add Comment'}
        </Button>
      </form>
    </Card>
  );
} 