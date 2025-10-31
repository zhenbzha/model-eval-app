import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModelsWithStats } from "@/app/actions/models";
import PageHeader from "../components/page-header";
import PageNav from "../components/page-nav";

export const dynamic = 'force-dynamic';

export default async function StatisticsPage() {
  const models = await getModelsWithStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <PageHeader />
      <PageNav />

      <div className="px-8 pt-6">
        <div className="p-6 max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Performance Statistics
                </h2>
                <p className="text-gray-600">View evaluation results for all models</p>
              </div>

              {/* Model Statistics Cards - Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model) => {
                  const total = model.thumbsUp + model.thumbsDown;
                  const successRate = total > 0 ? Math.round((model.thumbsUp / total) * 100) : 0;
                  const getStatusColor = (rate: number) => {
                    if (rate >= 80) return { text: "text-green-700", bar: "bg-green-500" };
                    if (rate >= 60) return { text: "text-yellow-700", bar: "bg-yellow-500" };
                    return { text: "text-red-700", bar: "bg-red-500" };
                  };
                  const status = getStatusColor(successRate);

                  return (
                    <Card key={model.id} className="border-2 border-gray-200 bg-white">
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          {/* Model Header */}
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                              {model.name}
                            </h3>
                            <p className="text-sm text-gray-600">{model.version}</p>
                          </div>

                          {/* Success Rate */}
                          <div className={cn("text-4xl font-bold text-center py-2", status.text)}>
                            {successRate}%
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={cn("h-full transition-all duration-500", status.bar)}
                              style={{ width: `${successRate}%` }}
                            />
                          </div>

                          {/* Vote Statistics */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between gap-2">
                              <span className="flex items-center gap-1 text-green-700 font-semibold">
                                <ThumbsUp className="w-4 h-4" />
                                {model.thumbsUp} Good
                              </span>
                              <span className="flex items-center gap-1 text-red-700 font-semibold">
                                <ThumbsDown className="w-4 h-4" />
                                {model.thumbsDown} Poor
                              </span>
                            </div>
                            <div className="text-center text-gray-600 font-semibold pt-1 border-t border-gray-300">
                              Total: {total}
                            </div>
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
