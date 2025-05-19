// Temporary placeholder page to allow build to complete

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  // For now, we'll just pre-render a single placeholder project page
  // In a real app, this would fetch all project IDs from a data source
  return [
    { id: 'placeholder' }
  ];
}

export default function ProjectPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Project Details</h1>
        <p className="mt-4 text-muted-foreground">
          This page is temporarily unavailable while we update our deployment process.
        </p>
      </div>
    </div>
  );
}
