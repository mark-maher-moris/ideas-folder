"use client";

import { Project, ProjectPhase } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Folder, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const phaseColors: Record<ProjectPhase, string> = {
  "Just Idea": "bg-blue-100 text-blue-800",
  "Team Formation": "bg-purple-100 text-purple-800",
  "Product Development": "bg-green-100 text-green-800",
  "Go-To-Market": "bg-yellow-100 text-yellow-800",
  "Scaling & Operations": "bg-orange-100 text-orange-800",
  "Profit & Growth": "bg-emerald-100 text-emerald-800",
  "Closed & Archived": "bg-gray-100 text-gray-800",
  "Unicorn": "bg-rose-100 text-rose-800"
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="folder-container relative w-full aspect-[4/3]">
          {/* Folder top tab */}
          <div className="absolute top-0 left-8 w-1/3 h-6 bg-primary/70 rounded-t-md z-10" />
          
          {/* Folder body */}
          <div className="absolute top-6 left-0 right-0 bottom-0 bg-primary/20 rounded-md overflow-hidden">
            {/* Project cover image */}
            {project.coverImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={project.coverImage}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Folder className="w-20 h-20 text-primary/40" />
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Badge className={`text-xs ${phaseColors[project.phase]}`}>
                {project.phase}
              </Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            
            <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mt-1">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.tags.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}