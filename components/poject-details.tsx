"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Users, ChevronLeft, ChevronRight, Github, Mail, Globe, Link, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Project, ProjectPhase } from "@/types/project";
import { ProjectCommentSection } from "./project-comment-section";
import Image from 'next/image';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

interface ProjectDetailsProps {
  project: Project;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = data.type === 'Profit' ? "#10b981" : "#ef4444";
    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p style={{ color }}>
          {data.type}: ${data.amount.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleCommentsUpdated = () => {
    // Force refresh when comments are updated
    setRefreshKey(prev => prev + 1);
  };

  // Safely format date for display
  const formatDate = (date: any) => {
    if (!date) return 'Unknown Date';
    
    try {
      // Handle Firebase Timestamp objects
      if (typeof date.toDate === 'function') {
        return new Date(date.toDate()).toLocaleDateString();
      }
      
      // Handle Date objects
      if (date instanceof Date) {
        return date.toLocaleDateString();
      }
      
      // Handle string dates
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      }
      
      return 'Unknown Date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown Date';
    }
  };

  // Prepare financial data for chart with safe date handling
  const financialData = (project.financialHistory || []).map(record => {
    let displayDate = formatDate(record.date);
    let type = record.isProfit ? 'Profit' : 'Loss';
    
    return {
      name: displayDate,
      amount: record.amount || 0,
      type: type
    };
  });

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
              {project.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Financial Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Financial Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <TrendingUp className="h-10 w-10 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Profit</p>
                    <p className="text-2xl font-bold">${(project.profit || 0).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <TrendingDown className="h-10 w-10 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Loss</p>
                    <p className="text-2xl font-bold">${(project.loss || 0).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Financial Chart */}
            {financialData.length > 0 && (
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Financial History</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={financialData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="amount" 
                        name="Amount" 
                        fill="#6366f1"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
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
              {project.requiredTalents?.map((talent) => (
                <Badge key={talent} variant="outline">
                  {talent}
                </Badge>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <ProjectCommentSection 
            key={`comments-${refreshKey}`} 
            project={project} 
            onCommentsUpdated={handleCommentsUpdated} 
          />
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
                    <p className="text-xs">
                      Shares: {member.shares || 0} (
                      {((member.shares / 100) * 100).toFixed(1)}%)
                    </p>

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