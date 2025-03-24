// Server Component
import { Project } from "@/types/project";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProjectDetails } from "@/components/poject-details";

// Fetch project data based on ID
async function fetchProject(id: string) {
  const projectDoc = await getDoc(doc(db, "projects", id));
  if (projectDoc.exists()) {
    return { id: projectDoc.id, ...projectDoc.data() } as Project;
  }
  return null;
}

// Generate static params for all projects
export async function generateStaticParams() {
  try {
    const projectsSnapshot = await getDocs(collection(db, "projects"));
    const projectIds = projectsSnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
    return projectIds;
  } catch (error) {
    console.error("Error fetching project IDs for static generation:", error);
    return [];
  }
}

// Server Component
export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await fetchProject(params.id);

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500">Project Not Found</h1>
          <p className="mt-4 text-muted-foreground">The requested project does not exist.</p>
        </div>
      </div>
    );
  }

  return <ProjectDetails project={project} />;
}
