"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const router = useRouter();

  const [attemptCount, setAttemptCount] = useState(0);
  const maxAttempts = 5;
  const verifyPasswords = async () => {
    console.log("Entered Passwords:", password1, password2);
    
    if (!db) {
      alert("Database not initialized.");
      return;
    }
  
    try {
      // Fetch the stored passwords
      const adminDocRef = doc(db, 'jadmin', 'jauth');
      const adminDoc = await getDoc(adminDocRef);
  
      if (!adminDoc.exists()) {
        alert("Admin credentials not found.");
        return;
      }
  
      const data = adminDoc.data();
  
      // Compare entered passwords with stored ones
      if (password1 === data.password1 && password2 === data.password2) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        setAttemptCount(0);
        console.log("Authentication successful!");
      } else {
        setAttemptCount((prev) => prev + 1);
        if (attemptCount + 1 >= maxAttempts) {
          alert("Maximum attempts exceeded, please try again later.");
          return;
        }
        alert("Invalid passwords");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed");
    }
  };
  
  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    setIsAuthenticated(isAdmin);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Admin Authentication</h2>
            <p className="text-muted-foreground mt-2">Enter both passwords to continue</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="First Password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Second Password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <button
              onClick={verifyPasswords}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90"
            >
              Authenticate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}