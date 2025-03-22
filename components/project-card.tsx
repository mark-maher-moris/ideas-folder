"use client";

import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Folder, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
          <div className="flex items-start gap-4 mb-4">
            <Folder className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-muted-foreground line-clamp-2 mt-1">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {project.requiredTalents.length} roles needed
            </div>
            <ArrowRight className="w-5 h-5 text-primary transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
}