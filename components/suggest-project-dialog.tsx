"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PlusCircle } from "lucide-react";

export function SuggestProjectDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectSuggestedName: "",
    ideaDescription: "",
    suggesterName: "",
    whatsappPhoneNumber: "",
    wantToWork: false,
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addDoc(collection(db!, "projectSuggestions"), {
        ...formData,
        upvotes: 0,
        downvotes: 0,
        comments: [],
        createdAt: new Date(),
      });

      setFormData({
        projectSuggestedName: "",
        ideaDescription: "",
        suggesterName: "",
        whatsappPhoneNumber: "",
        wantToWork: false,
        isPublic: true,
      });
      
      // Close dialog after successful submission
      const closeButton = document.querySelector("[data-dialog-close]");
      if (closeButton instanceof HTMLElement) {
        closeButton.click();
      }
    } catch (error) {
      console.error("Error submitting project suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Suggest Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suggest a New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={formData.projectSuggestedName}
              onChange={(e) => setFormData({ ...formData, projectSuggestedName: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.ideaDescription}
              onChange={(e) => setFormData({ ...formData, ideaDescription: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suggesterName">Your Name</Label>
            <Input
              id="suggesterName"
              value={formData.suggesterName}
              onChange={(e) => setFormData({ ...formData, suggesterName: e.target.value })}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wantToWork"
              checked={formData.wantToWork}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, wantToWork: checked as boolean })
              }
            />
            <Label htmlFor="wantToWork">I want to work on this project</Label>
          </div>
          
          {formData.wantToWork && (
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsappPhoneNumber}
                onChange={(e) => setFormData({ ...formData, whatsappPhoneNumber: e.target.value })}
                required
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isPublic: checked as boolean })
              }
            />
            <Label htmlFor="isPublic">Make this suggestion public</Label>
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Don't fear sharing your ideas. The real challenge is bringing them to life, not just thinking about them.
        </p>
      </DialogContent>
    </Dialog>
  );
}