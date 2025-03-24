"use client";

import { Github, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true';
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-4 px-6 text-3xl">
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-black">Ideas Folder</span>
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
          <Button variant="outline" size="sm">
            Suggest Project
          </Button>
        </nav>
      </div>
    </header>
  );
}
