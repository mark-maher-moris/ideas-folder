'use client'
import { ProjectGrid } from '@/components/project-grid';
import { SuggestedIdeas } from '@/components/suggested-ideas';
import { SuggestProjectDialog } from '@/components/suggest-project-dialog';
import { Activity, BarChart, Divide, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HomeAnalytics from '@/components/home-analytics';


export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsList = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));
        setProjects(projectsList);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error fetching projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Activity className="animate-spin h-10 w-10" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
           <HomeAnalytics projects={[...projects]} />
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">All Projects</h2>
              <ProjectGrid   projects={[...projects]}/>
            </section>
            <div className="border-t border-muted-foreground my-12" />
            <section>
              <h2 className="text-2xl font-semibold mb-6">Suggested Ideas</h2>
              <div className="flex items-center justify-between mb-8">
                <SuggestProjectDialog />
              </div>
              <SuggestedIdeas />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

