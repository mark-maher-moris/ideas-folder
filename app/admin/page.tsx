"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Project } from '@/types/project';
import { BarChart, Users, Activity, X, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalClicks: 0,
    activeUsers: 0,
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    joinLink: '',
    tags: '',
    requiredTalents: '',
    coverImage: '',
    images: [] as string[],
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchAnalytics();
  }, []);

  const fetchProjects = async () => {
    const projectsSnapshot = await getDocs(collection(db!, 'projects'));
    const projectsList = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
    setProjects(projectsList);
  };

  const fetchAnalytics = async () => {
    const analyticsSnapshot = await getDocs(collection(db!, 'analytics'));
    if (!analyticsSnapshot.empty) {
      const data = analyticsSnapshot.docs[0].data();
      setAnalytics({
        totalViews: data.totalViews || 0,
        totalClicks: data.totalClicks || 0,
        activeUsers: data.activeUsers || 0,
      });
    }
  };

  const uploadImage = async (file: File, path: string) => {
    const storageRef = ref(storage!, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let coverImageUrl = '';
      let additionalImageUrls: string[] = [];

      // Upload cover image
      if (coverImageFile) {
        const timestamp = Date.now();
        coverImageUrl = await uploadImage(
          coverImageFile,
          `projects/${timestamp}_${coverImageFile.name}`
        );
      }

      // Upload additional images
      for (const file of additionalImages) {
        const timestamp = Date.now();
        const url = await uploadImage(
          file,
          `projects/${timestamp}_${file.name}`
        );
        additionalImageUrls.push(url);
      }

      await addDoc(collection(db!, 'projects'), {
        ...newProject,
        coverImage: coverImageUrl,
        images: additionalImageUrls,
        tags: newProject.tags.split(',').map(tag => tag.trim()),
        requiredTalents: newProject.requiredTalents.split(',').map(talent => talent.trim()),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setNewProject({
        name: '',
        description: '',
        joinLink: '',
        tags: '',
        requiredTalents: '',
        coverImage: '',
        images: [],
      });
      setCoverImageFile(null);
      setAdditionalImages([]);
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAdditionalImages(Array.from(e.target.files));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <BarChart className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">{analytics.totalViews}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{analytics.activeUsers}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Activity className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold">{analytics.totalClicks}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-1">Project Name</Label>
              <Input
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-1">Description</Label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-1">Join Link</Label>
              <Input
                value={newProject.joinLink}
                onChange={(e) => setNewProject({ ...newProject, joinLink: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-1">Tags (comma-separated)</Label>
              <Input
                value={newProject.tags}
                onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-1">Required Talents (comma-separated)</Label>
              <Input
                value={newProject.requiredTalents}
                onChange={(e) => setNewProject({ ...newProject, requiredTalents: e.target.value })}
                required
              />
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Cover Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="flex-1"
                />
                {coverImageFile && (
                  <div className="flex items-center gap-2 bg-muted p-2 rounded">
                    <span className="text-sm truncate max-w-[200px]">{coverImageFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCoverImageFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">Additional Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
              />
              {additionalImages.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {additionalImages.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Add Project'}
            </Button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Existing Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-start gap-4">
                  {project.coverImage && (
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="mt-2">
                      <p className="text-sm">Required Talents: {project.requiredTalents.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}