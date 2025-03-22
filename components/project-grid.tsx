"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types/project';
import { ProjectCard } from './project-card';
import { motion } from 'framer-motion';

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db!, 'projects');
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      setProjects(projectsList);
    };

    fetchProjects();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}