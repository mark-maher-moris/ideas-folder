"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types/project";

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
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Image */}
        <div>
          {(project.coverImage || project.images?.length > 0) && (
            <Card className="overflow-hidden">
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
                                  ? "bg-primary"
                                  : "bg-primary/30"
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
        </div>

        {/* Right Side: Details */}
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.requiredTalents.map((talent, index) => (
                  <Card
                    key={index}
                    className="flex items-center gap-2 p-4 bg-secondary rounded-lg"
                  >
                    <Users className="w-5 h-5 text-primary" />
                    <span>{talent}</span>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex justify-start">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => window.open(project.joinLink, "_blank")}
            >
              Join Project Team
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}