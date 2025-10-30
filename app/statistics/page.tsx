import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModelsWithStats } from "@/app/actions/models";
import PageHeader from "../components/page-header";
import PageNav from "../components/page-nav";

export default async function StatisticsPage() {
  const models = await getModelsWithStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <PageHeader />
      <PageNav />

      <div className="px-8 pt-6">
        <div className="p-6 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Performance Statistics</h2>
                <p className="text-gray-600">View evaluation results for all models</p>
              </div>

              {/* Model Statistics Cards */}
              <div className="space-y-4">
                {models.map((model) => {
                  const total = model.thumbsUp + model.thumbsDown;
                  const successRate = total > 0 ? Math.round((model.thumbsUp / total) * 100) : 0;
                  const getStatusColor = (rate: number) => {
                    if (rate >= 80) return { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", bar: "bg-green-500", icon: "✅" };
                    if (rate >= 60) return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", bar: "bg-yellow-500", icon: "⚠️" };
                    return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", bar: "bg-red-500", icon: "❌" };
                  };
                  const status = getStatusColor(successRate);

                  return (
                    <Card key={model.id} className={cn("border-2", status.border, status.bg)}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Model Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {model.name}
                                </h3>
                                <p className="text-sm text-gray-600">{model.version}</p>
                              </div>
                            </div>
                            <div className={cn("text-2xl font-bold", status.text)}>
                              {successRate}%
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={cn("h-full transition-all duration-500", status.bar)}
                              style={{ width: `${successRate}%` }}
                            />
                          </div>

                          {/* Vote Statistics */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1 text-green-700 font-semibold">
                                <ThumbsUp className="w-4 h-4" />
                                {model.thumbsUp} Good
                              </span>
                              <span className="flex items-center gap-1 text-red-700 font-semibold">
                                <ThumbsDown className="w-4 h-4" />
                                {model.thumbsDown} Poor
                              </span>
                            </div>
                            <span className="text-gray-600 font-semibold">
                              📈 Total: {total}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
