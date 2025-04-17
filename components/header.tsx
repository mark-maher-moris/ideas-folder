"use client";

import { Github, Settings, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { SuggestProjectDialog } from "./suggest-project-dialog";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useEffect } from "react";

export function Header() {
  const { isSignedIn, userId } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setIsMounted(true);
    // Check admin status from localStorage (will be replaced by Clerk metadata in future)
    const adminStatus = localStorage.getItem('adminAuth') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  // Avoid hydration mismatch by not rendering user-specific elements on first render
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-4 px-6 text-3xl">
            <img src="/my_folders.png" alt="Ideas Folder" className="h-28 w-auto" />
          </Link>
          <div className="w-40"></div> {/* Placeholder to maintain layout */}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-4 px-6 text-3xl">
          <img src="/my_folders.png" alt="Ideas Folder" className="h-28 w-auto" />
        </Link>
        
        <nav className="flex items-center gap-4">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/projects">Projects</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ideas">Ideas</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <SuggestProjectDialog />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {isSignedIn ? (
                    <div className="flex w-full items-center justify-between">
                      <span>Account</span>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  ) : (
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </SignInButton>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
              
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
