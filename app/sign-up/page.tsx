import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground mt-2">Create an account to collaborate on projects</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              card: "shadow-md border border-border",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
} 