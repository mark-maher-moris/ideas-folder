import { useState } from 'react';
import { Project, SuggestedIdea, Comment } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';

interface ProjectDetailsProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export function ProjectDetails({ project, onUpdateProject }: ProjectDetailsProps) {
  const [newComment, setNewComment] = useState('');
  const [newIdea, setNewIdea] = useState<Omit<SuggestedIdea, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment.trim(),
      author: 'Anonymous', // You might want to get this from user context
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProject = {
      ...project,
      comments: [...(project.comments || []), comment],
    };

    onUpdateProject(updatedProject);
    setNewComment('');
  };

  const handleSuggestIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.title.trim() || !newIdea.description.trim()) return;

    const idea: SuggestedIdea = {
      id: Date.now().toString(),
      title: newIdea.title.trim(),
      description: newIdea.description.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProject = {
      ...project,
      suggestedIdeas: [...(project.suggestedIdeas || []), idea],
    };

    onUpdateProject(updatedProject);
    setNewIdea({ title: '', description: '' });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Suggested Ideas</h3>
        {project.suggestedIdeas?.map((idea) => (
          <div key={idea.id} className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{idea.title}</h4>
                <p className="text-sm text-muted-foreground">{idea.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(idea.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
        <form onSubmit={handleSuggestIdea} className="space-y-2">
          <Input
            placeholder="Idea title"
            value={newIdea.title}
            onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
          />
          <Textarea
            placeholder="Describe your idea"
            value={newIdea.description}
            onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
          />
          <Button type="submit" className="w-full">Suggest Idea</Button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        {project.comments?.map((comment) => (
          <div key={comment.id} className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{comment.author}</p>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
        <form onSubmit={handleAddComment} className="space-y-2">
          <Textarea
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" className="w-full">Add Comment</Button>
        </form>
      </div>
    </div>
  );
} 