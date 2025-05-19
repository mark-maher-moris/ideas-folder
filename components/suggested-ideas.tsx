"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, updateDoc, doc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProjectSuggestion } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { formatDistanceToNow } from 'date-fns';

export function SuggestedIdeas() {
  const [suggestions, setSuggestions] = useState<ProjectSuggestion[]>([]);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [commentUserNames, setCommentUserNames] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    const suggestionsCollection = collection(db!, 'projectSuggestions');
    const q = query(
      suggestionsCollection,
      where('isPublic', '==', true),
      orderBy('upvotes', 'desc')
    );
    const suggestionsSnapshot = await getDocs(q);
    const suggestionsList = suggestionsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        comments: data.comments?.map((comment: any) => ({
          ...comment,
          createdAt: comment.createdAt?.toDate() || new Date(),
          updatedAt: comment.updatedAt?.toDate() || new Date(),
        })) || [],
      } as ProjectSuggestion;
    });
    setSuggestions(suggestionsList);
  };

  const handleVote = async (suggestionId: string, voteType: 'up' | 'down') => {
    try {
      const suggestionRef = doc(db!, 'projectSuggestions', suggestionId);
      const suggestion = suggestions.find(s => s.id === suggestionId);
      
      if (!suggestion) return;

      const updates = {
        upvotes: suggestion.upvotes + (voteType === 'up' ? 1 : 0),
        downvotes: suggestion.downvotes + (voteType === 'down' ? 1 : 0),
        updatedAt: Timestamp.now()
      };

      await updateDoc(suggestionRef, updates);
      await fetchSuggestions(); // Refresh the suggestions list
    } catch (error) {
      console.error('Error updating votes:', error);
    }
  };

  const toggleComments = (suggestionId: string) => {
    setShowComments(prev => ({
      ...prev,
      [suggestionId]: !prev[suggestionId]
    }));
  };

  const handleAddComment = async (suggestionId: string) => {
    if (!newComments[suggestionId]?.trim() || !commentUserNames[suggestionId]?.trim()) return;

    try {
      const suggestionRef = doc(db!, 'projectSuggestions', suggestionId);
      const comment = {
        id: Date.now().toString(),
        author: commentUserNames[suggestionId],
        content: newComments[suggestionId],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await updateDoc(suggestionRef, {
        comments: arrayUnion(comment),
        updatedAt: Timestamp.now()
      });

      // Clear the input fields and refresh suggestions
      setNewComments(prev => ({ ...prev, [suggestionId]: '' }));
      setCommentUserNames(prev => ({ ...prev, [suggestionId]: '' }));
      await fetchSuggestions();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="grid gap-6">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">
                  {suggestion.projectSuggestedName}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(suggestion.createdAt, { addSuffix: true })}
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                {suggestion.ideaDescription}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Idea by {suggestion.suggesterName}</span>
                {suggestion.wantToWork && (
                  <Badge variant="secondary">Wants to Work</Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => handleVote(suggestion.id, 'up')}
              >
                <ThumbsUp className="w-4 h-4" />
                {suggestion.upvotes}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => handleVote(suggestion.id, 'down')}
              >
                <ThumbsDown className="w-4 h-4" />
                {suggestion.downvotes}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => toggleComments(suggestion.id)}
              >
                <MessageSquare className="w-4 h-4" />
                {suggestion.comments.length}
              </Button>
            </div>
          </div>

          {showComments[suggestion.id] && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-semibold mb-4">Comments</h4>
              <div className="space-y-4 mb-4">
                {suggestion.comments.map((comment) => (
                  <div key={comment.id} className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`username-${suggestion.id}`}>Your Name</Label>
                  <Input
                    id={`username-${suggestion.id}`}
                    value={commentUserNames[suggestion.id] || ''}
                    onChange={(e) => setCommentUserNames(prev => ({
                      ...prev,
                      [suggestion.id]: e.target.value
                    }))}
                    placeholder="Enter your name"
                    className="mb-2"
                  />
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={newComments[suggestion.id] || ''}
                    onChange={(e) => setNewComments(prev => ({
                      ...prev,
                      [suggestion.id]: e.target.value
                    }))}
                    placeholder="Add a comment..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleAddComment(suggestion.id)}
                    size="icon"
                    className="h-full"
                  >
                    <Send className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}