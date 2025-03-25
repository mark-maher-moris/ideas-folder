import { Project } from "@/types/project";
import { Card } from "./ui/card";

export default function HomeAnalytics({ projects }: { projects: Project[] }) {

    return (
        <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-4 h-20">
                <div className="flex items-center gap-4">
                  <img src="/ideas_folder.png" alt="Ideas Folder" className="h-12 w-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ideas Folder</p>
                    <p className="text-lg font-bold">{projects.filter(p => p.phase === "Just Idea").length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 h-20">
                <div className="flex items-center gap-4">
                  <img src="/startups_folder.png" alt="Ideas Folder" className="h-12 w-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground">Startups Folder</p>
                    <p className="text-lg font-bold">{projects.filter(p => ["Product Development", "Go-To-Market", "Scaling & Operations", "Profit & Growth"].includes(p.phase)).length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 h-20">
                <div className="flex items-center gap-4">
                  <img src="/unicorns_folder.png" alt="Ideas Folder" className="h-12 w-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground">Unicorn Folder</p>
                    <p className="text-lg font-bold">{projects.filter(p => p.phase === "Unicorn").length}</p>
                  </div>
                </div>
              </Card>
            </div></>
    )
}