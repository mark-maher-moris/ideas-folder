"use client";

import { Project, ProjectPhase } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Folder, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
        
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Folder className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
            <Badge className={`text-xs ${phaseColors[project.phase]}`}>
                  {project.phase}
                </Badge>
              <div className="flex items-center gap-2 mb-1">
            
                <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
             
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
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
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Card>
    </Link>
  );
}