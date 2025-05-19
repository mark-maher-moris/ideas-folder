"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Project, ProjectPhase, TeamMember, Comment, SuggestedIdea, FinancialRecord } from '@/types/project';
import { BarChart, Users, Activity, X, Plus, Trash2, Pencil, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

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
    tags: [] as string[],
    requiredTalents: [] as string[],
    coverImage: '',
    images: [] as string[],
    phase: 'Just Idea' as ProjectPhase,
    team: [] as TeamMember[],
    comments: [] as Comment[],
    suggestedIdeas: [] as SuggestedIdea[],
    profit: 0,
    loss: 0,
    financialHistory: [] as FinancialRecord[],
  });
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState<TeamMember>({
    name: '',
    email: '',
    imageUrl: '',
    contactLink: '',
    role: '',
    shares: 0,
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newTalent, setNewTalent] = useState('');
  const [newFinancialRecord, setNewFinancialRecord] = useState<Omit<FinancialRecord, 'id' | 'date'>>({
    amount: 0,
    isProfit: true,
    description: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchAnalytics();
  }, []);

  const fetchProjects = async () => {
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    const projectsList = projectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      team: doc.data().team || [],
    } as Project));
    setProjects(projectsList);
  };

  const fetchAnalytics = async () => {
    try {
      const analyticsSnapshot = await getDocs(collection(db, 'analytics'));
      if (!analyticsSnapshot.empty) {
        const data = analyticsSnapshot.docs[0].data();
        setAnalytics({
          totalViews: data.totalViews || 0,
          totalClicks: data.totalClicks || 0,
          activeUsers: data.activeUsers || 0,
        });
      } else {
        // Initialize analytics if not exists
        await addDoc(collection(db, 'analytics'), {
          totalViews: 0,
          totalClicks: 0,
          activeUsers: 0,
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const projectData = {
        ...newProject,
        images: additionalImageUrls.filter(url => url.trim().length > 0),
        updatedAt: new Date(),
      };

      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: new Date(),
        });
      }
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinancialRecordSubmit = (e: React.MouseEvent | React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();
    
    if (!newFinancialRecord.amount || !newFinancialRecord.description) {
      return;
    }
    
    const financialRecord: FinancialRecord = {
      ...newFinancialRecord,
      id: Date.now().toString(),
      date: new Date()
    };
    
    const updatedFinancialHistory = [...newProject.financialHistory, financialRecord];
    
    // Update total profit or loss
    let updatedProfit = newProject.profit;
    let updatedLoss = newProject.loss;
    
    if (financialRecord.isProfit) {
      updatedProfit += financialRecord.amount;
    } else {
      updatedLoss += financialRecord.amount;
    }
    
    setNewProject({
      ...newProject,
      financialHistory: updatedFinancialHistory,
      profit: updatedProfit,
      loss: updatedLoss
    });
    
    setNewFinancialRecord({
      amount: 0,
      isProfit: true,
      description: ''
    });
  };

  const removeFinancialRecord = (index: number) => {
    const recordToRemove = newProject.financialHistory[index];
    const updatedFinancialHistory = newProject.financialHistory.filter((_, i) => i !== index);
    
    // Update total profit or loss
    let updatedProfit = newProject.profit;
    let updatedLoss = newProject.loss;
    
    if (recordToRemove.isProfit) {
      updatedProfit -= recordToRemove.amount;
    } else {
      updatedLoss -= recordToRemove.amount;
    }
    
    setNewProject({
      ...newProject,
      financialHistory: updatedFinancialHistory,
      profit: updatedProfit,
      loss: updatedLoss
    });
  };

  const resetForm = () => {
    setNewProject({
      name: '',
      description: '',
      joinLink: '',
      tags: [],
      requiredTalents: [],
      coverImage: '',
      images: [],
      phase: 'Just Idea',
      team: [],
      comments: [],
      suggestedIdeas: [],
      profit: 0,
      loss: 0,
      financialHistory: [],
    });
    setAdditionalImageUrls([]);
    setNewTeamMember({
      name: '',
      email: '',
      imageUrl: '',
      contactLink: '',
      role: '',
      shares: 0,

    });
    setNewTag('');
    setNewTalent('');
    setEditingProject(null);
    setNewFinancialRecord({
      amount: 0,
      isProfit: true,
      description: ''
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setNewProject({
      ...project,
      tags: project.tags || [],
      requiredTalents: project.requiredTalents || [],
      comments: project.comments || [],
      suggestedIdeas: project.suggestedIdeas || [],
    });
    setAdditionalImageUrls(project.images || []);
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    
    try {
      await deleteDoc(doc(db, 'projects', deleteProjectId));
      fetchProjects();
      setDeleteProjectId(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProject({ ...newProject, coverImage: e.target.value });
  };

  const handleAdditionalImageChange = (index: number, value: string) => {
    const updatedImages = [...additionalImageUrls];
    updatedImages[index] = value;
    setAdditionalImageUrls(updatedImages);
    setNewProject({ ...newProject, images: updatedImages });
  };

  const addAdditionalImageField = () => {
    setAdditionalImageUrls([...additionalImageUrls, '']);
  };

  const removeAdditionalImageField = (index: number) => {
    const updatedImages = additionalImageUrls.filter((_, i) => i !== index);
    setAdditionalImageUrls(updatedImages);
    setNewProject({ ...newProject, images: updatedImages });
  };

  const addTeamMember = () => {
    if (newTeamMember.name && newTeamMember.email) {
      setNewProject({
        ...newProject,
        team: [...newProject.team, newTeamMember],
      });
      setNewTeamMember({
        name: '',
        email: '',
        imageUrl: '',
        contactLink: '',
        role: '',
        shares: 0,

      });
    }
  };

  const removeTeamMember = (index: number) => {
    const updatedTeam = newProject.team.filter((_, i) => i !== index);
    setNewProject({ ...newProject, team: updatedTeam });
  };

  const addTag = () => {
    if (newTag.trim()) {
      setNewProject({
        ...newProject,
        tags: [...newProject.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setNewProject({
      ...newProject,
      tags: newProject.tags.filter((_, i) => i !== index),
    });
  };

  const addTalent = () => {
    if (newTalent.trim()) {
      setNewProject({
        ...newProject,
        requiredTalents: [...newProject.requiredTalents, newTalent.trim()],
      });
      setNewTalent('');
    }
  };

  const removeTalent = (index: number) => {
    setNewProject({
      ...newProject,
      requiredTalents: newProject.requiredTalents.filter((_, i) => i !== index),
    });
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
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h2>
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
              <Label className="block text-sm font-medium mb-1">Project Phase</Label>
              <Select
                value={newProject.phase}
                onValueChange={(value: ProjectPhase) => 
                  setNewProject({ ...newProject, phase: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Just Idea">Just Idea</SelectItem>
                  <SelectItem value="Team Formation">Team Formation</SelectItem>
                  <SelectItem value="Product Development">Product Development</SelectItem>
                  <SelectItem value="Go-To-Market">Go-To-Market</SelectItem>
                  <SelectItem value="Scaling & Operations">Scaling & Operations</SelectItem>
                  <SelectItem value="Profit & Growth">Profit & Growth</SelectItem>
                  <SelectItem value="Closed & Archived">Closed & Archived</SelectItem>
                </SelectContent>
              </Select>
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
              <Label className="block text-sm font-medium mb-1">Tags</Label>
              <div className="space-y-2">
                {newProject.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="flex-1">
                      <p className="font-medium">{tag}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    className="whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Required Talents</Label>
              <div className="space-y-2">
                {newProject.requiredTalents.map((talent, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="flex-1">
                      <p className="font-medium">{talent}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTalent(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a required talent"
                    value={newTalent}
                    onChange={(e) => setNewTalent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTalent();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTalent}
                    className="whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Talent
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Cover Image URL</Label>
              <Input
                type="text"
                value={newProject.coverImage}
                onChange={handleCoverImageChange}
                placeholder="Enter cover image URL"
                required
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Additional Images URLs</Label>
              {additionalImageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    type="text"
                    value={url}
                    onChange={(e) => handleAdditionalImageChange(index, e.target.value)}
                    placeholder={`Image ${index + 1} URL`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalImageField(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addAdditionalImageField}>
                Add Image URL
              </Button>
            </div>

            <div className="space-y-4">
              <Label className="block text-sm font-medium">Team Members</Label>
              {newProject.team.map((member, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="space-y-2">
                <Input
                  placeholder="Team member name"
                  value={newTeamMember.name}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Team member email"
                  value={newTeamMember.email}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                />
                    <Input
        type="number"
        value={newTeamMember.shares}
        onChange={(e) => setNewTeamMember({ ...newTeamMember, shares: parseInt(e.target.value) })}
        placeholder="Shares"
      />
                <Input
                  placeholder="Team member image URL (optional)"
                  value={newTeamMember.imageUrl}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, imageUrl: e.target.value })}
                />
                 <Input
                  placeholder="Role"
                  value={newTeamMember.role}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                />
                <Input
                  placeholder="Contact link (optional)"
                  value={newTeamMember.contactLink}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, contactLink: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTeamMember}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </div>

            {/* Financial Information */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="total-profit">Total Profit</Label>
                  <Input
                    id="total-profit"
                    value={`$${newProject.profit.toLocaleString()}`}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="total-loss">Total Loss</Label>
                  <Input
                    id="total-loss"
                    value={`$${newProject.loss.toLocaleString()}`}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label>Financial Records</Label>
                {newProject.financialHistory.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {newProject.financialHistory.map((record, index) => (
                      <div key={record.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div>
                          <span className={record.isProfit ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {record.isProfit ? '+' : '-'}${record.amount.toLocaleString()}
                          </span>
                          <span className="mx-2">-</span>
                          <span>{record.description}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {record.date.toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFinancialRecord(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No financial records added yet.</p>
                )}
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Add Financial Record</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newFinancialRecord.amount}
                        onChange={(e) => setNewFinancialRecord({
                          ...newFinancialRecord,
                          amount: parseFloat(e.target.value) || 0
                        })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="is-profit">Type</Label>
                      <Select
                        value={newFinancialRecord.isProfit ? "profit" : "loss"}
                        onValueChange={(value) => setNewFinancialRecord({
                          ...newFinancialRecord,
                          isProfit: value === "profit"
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="profit">Profit</SelectItem>
                          <SelectItem value="loss">Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newFinancialRecord.description}
                      onChange={(e) => setNewFinancialRecord({
                        ...newFinancialRecord,
                        description: e.target.value
                      })}
                      required
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFinancialRecordSubmit(e);
                    }}
                  >
                    Add Record
                  </Button>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? 'Saving...' : editingProject ? 'Save Changes' : 'Add Project'}
            </Button>
            {editingProject && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="w-full mt-2"
              >
                Cancel Edit
              </Button>
            )}
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Current Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary">{project.phase}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {(project.team || []).length} team members
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProject(project)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteProjectId(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}