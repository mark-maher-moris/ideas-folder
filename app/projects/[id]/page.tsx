"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db!, 'projects', params.id));
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() } as Project);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError('Error loading project');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const nextImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-muted-foreground">{error || 'Project not found'}</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {(project.coverImage || project.images?.length > 0) && (
          <Card className="mb-8 overflow-hidden">
            <div className="relative aspect-video">
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              )}
              
              {project.images && project.images.length > 0 && (
                <div className="relative w-full h-full">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={project.images[currentImageIndex]}
                      alt={`${project.name} - Image ${currentImageIndex + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                  
                  {project.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        onClick={previousImage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {project.images.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? 'bg-primary'
                                : 'bg-primary/30'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">About this Project</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        </Card>

        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Required Talents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.requiredTalents.map((talent) => (
                <div
                  key={talent}
                  className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
                >
                  <Users className="w-5 h-5 text-primary" />
                  <span>{talent}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => window.open(project.joinLink, '_blank')}
          >
            Join Project Team
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}