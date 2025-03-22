import { ProjectGrid } from '@/components/project-grid';
import { SuggestedIdeas } from '@/components/suggested-ideas';
import { SuggestProjectDialog } from '@/components/suggest-project-dialog';
import { Divide } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Active Projects</h2>
          <ProjectGrid />
        </section>

        <div className="border-t border-muted-foreground my-12" />

        <section>
          <h2 className="text-2xl font-semibold mb-6">Suggested Ideas</h2>
          <div className="flex items-center justify-between mb-8">
          <SuggestProjectDialog />
        </div>
          <SuggestedIdeas />
        
        </section>
      </div>
    </main>
  );
}
