import { Project } from "@/types/project";
import { Card } from "./ui/card";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function HomeAnalytics({ projects }: { projects: Project[] }) {
    // Calculate total profit and loss
    const totalProfit = projects.reduce((sum, project) => sum + (project.profit || 0), 0);
    const totalLoss = projects.reduce((sum, project) => sum + (project.loss || 0), 0);
    const netProfit = totalProfit - totalLoss;

    // Prepare data for financial chart
    const financialData = projects.map(project => ({
        name: project.name,
        profit: project.profit || 0,
        loss: project.loss || 0,
        net: (project.profit || 0) - (project.loss || 0)
    })).sort((a, b) => b.net - a.net).slice(0, 5); // Top 5 projects by net profit

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
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-4 h-20">
                    <div className="flex items-center gap-4">
                        <ArrowUpCircle className="h-12 w-12 text-green-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Total Profit</p>
                            <p className="text-lg font-bold">${totalProfit.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 h-20">
                    <div className="flex items-center gap-4">
                        <ArrowDownCircle className="h-12 w-12 text-red-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Total Loss</p>
                            <p className="text-lg font-bold">${totalLoss.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 h-20">
                    <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {netProfit >= 0 ? '+' : '-'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Net Profit</p>
                            <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${Math.abs(netProfit).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Financial Chart */}
            {financialData.length > 0 && (
                <Card className="p-4 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Financial Performance (Top 5 Projects)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={financialData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="profit" name="Profit" fill="#10b981" />
                                <Bar dataKey="loss" name="Loss" fill="#ef4444" />
                                <Bar dataKey="net" name="Net Profit" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            )}
        </>
    )
}