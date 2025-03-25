"use client";

import { Github, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { SuggestProjectDialog } from "./suggest-project-dialog";





export function Header() {
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true';


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-4 px-6 text-3xl">
          <img src="/my_folders.png" alt="Ideas Folder" className="h-28 w-auto" />
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link href="/projects" className="text-sm font-medium hover:text-primary">
            Projects
          </Link>
          <Link href="/ideas" className="text-sm font-medium hover:text-primary">
            Ideas
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          )}
          
          <SuggestProjectDialog />


        </nav>
      </div>
    </header>
  );
}
