"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Users, ChevronLeft, ChevronRight, Github, Mail, Globe, Link } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Project, ProjectPhase } from "@/types/project";
import Image from 'next/image';

const phaseColors: Record<ProjectPhase, string> = {
  "Just Idea": "bg-blue-100 text-blue-800",
  "Team Formation": "bg-purple-100 text-purple-800",
  "Product Development": "bg-green-100 text-green-800",
  "Go-To-Market": "bg-yellow-100 text-yellow-800",
  "Scaling & Operations": "bg-orange-100 text-orange-800",
  "Profit & Growth": "bg-emerald-100 text-emerald-800",
  "Closed & Archived": "bg-gray-100 text-gray-800"
};

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (project.images) {
      setCurrentImageIndex((prev) =>
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (project.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold">{project.name}</h1>
              <Badge className={`text-sm ${phaseColors[project.phase]}`}>
                {project.phase}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Project Images */}
          { project.images && project.images.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Project Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${project.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Talents */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Required Talents</h2>
            <div className="flex flex-wrap gap-2">
              {project.requiredTalents.map((talent) => (
                <Badge key={talent} variant="outline">
                  {talent}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Join Button */}
          <Card className="p-6">
            <Button className="w-full" size="lg" asChild>
              <a href={project.joinLink} target="_blank" rel="noopener noreferrer">
                Join Project
                {/* <ExternalLink className="w-4 h-4 ml-2" /> */}
              </a>
            </Button>
          </Card>

   {/* Needed For This Project Section */}
   <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Needed For This Project</h2>
            <div className="space-y-4">
              {(project.requiredTalents || []).map((talent, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{talent}</h3>
                   
                  </div>
                </div>
              ))}
         
            </div>
          </Card>




          {/* Team Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Current Team Members</h2>
            <div className="space-y-4">
              {(project.team || []).map((member, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                  {member.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{member.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {member.contactLink && (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary"
                        > 
                          <a
                            href={member.contactLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Link className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {member.role && (
                        <Badge variant="secondary" className="text-xs">
                          {member.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(project.team || []).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No team members yet
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}