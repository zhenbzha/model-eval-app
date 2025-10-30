"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, ThumbsDown, Sparkles, ClipboardList, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for models with vote statistics
const models = [
  {
    id: "1",
    name: "Vision Detection",
    version: "v1.2",
    description: "Object detection and classification",
    icon: "🔍",
    thumbsUp: 247,
    thumbsDown: 18
  },
  {
    id: "2",
    name: "Quality Control",
    version: "v2.0",
    description: "Defect detection and quality assessment",
    icon: "✅",
    thumbsUp: 134,
    thumbsDown: 66
  },
  {
    id: "3",
    name: "Assembly Verification",
    version: "v1.5",
    description: "Assembly correctness verification",
    icon: "🔧",
    thumbsUp: 176,
    thumbsDown: 24
  },
  {
    id: "4",
    name: "Predictive Maintenance",
    version: "v3.1",
    description: "Equipment failure prediction",
    icon: "⚙️",
    thumbsUp: 67,
    thumbsDown: 82
  },
];

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>("1");
  const [feedback, setFeedback] = useState<{ modelId: string; type: "up" | "down" } | null>(null);

  const handleVote = (type: "up" | "down") => {
    if (!selectedModel) return;

    setFeedback({ modelId: selectedModel, type });

    // Clear feedback after 2 seconds
    setTimeout(() => setFeedback(null), 2000);
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  // Calculate overall statistics
  const totalVotes = models.reduce((acc, model) => acc + model.thumbsUp + model.thumbsDown, 0);
  const totalThumbsUp = models.reduce((acc, model) => acc + model.thumbsUp, 0);
  const averageSuccessRate = totalVotes > 0 ? Math.round((totalThumbsUp / totalVotes) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Model Performance Evaluation
                </h1>
                <p className="text-gray-600 mt-1">
                  Select a model and rate its performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 pt-6">
        <Tabs defaultValue="evaluate" className="w-full">
          <TabsList className="bg-white/80 backdrop-blur-sm shadow-sm h-12">
            <TabsTrigger value="evaluate" className="gap-2 text-base px-6 cursor-pointer">
              <ClipboardList className="w-4 h-4" />
              Evaluate
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2 text-base px-6 cursor-pointer">
              <BarChart3 className="w-4 h-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Evaluate Tab */}
          <TabsContent value="evaluate" className="mt-0">
            <div className="flex h-[calc(100vh-200px)]">
        {/* Left Sidebar - Model Selection */}
        <div className="w-[35%] bg-white/60 backdrop-blur-sm border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Select Model</h2>
              <p className="text-sm text-gray-600">Choose a model to evaluate</p>
            </div>

            {/* Model Cards */}
            <div className="space-y-3">
              {models.map((model) => (
                <Card
                  key={model.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                    selectedModel === model.id
                      ? "border-2 border-indigo-500 bg-indigo-50 shadow-md"
                      : "border border-gray-200 hover:border-indigo-300 bg-white"
                  )}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{model.name}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {model.version}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                      </div>
                      {selectedModel === model.id && (
                        <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Voting Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl space-y-6">
            <>
                {/* Thumbs Up Card */}
                <Card
                  className="w-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-400 group"
                  onClick={() => handleVote("up")}
                >
                  <CardContent className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <ThumbsUp className="w-12 h-12 text-green-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-3xl font-bold text-green-800">Good Performance</h3>
                      <p className="text-green-700">Model is performing as expected</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Thumbs Down Card */}
                <Card
                  className="w-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-400 group"
                  onClick={() => handleVote("down")}
                >
                  <CardContent className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <ThumbsDown className="w-12 h-12 text-red-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-3xl font-bold text-red-800">Poor Performance</h3>
                      <p className="text-red-700">Model needs improvement</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Message */}
                {feedback && feedback.modelId === selectedModel && (
                  <div
                    className={cn(
                      "w-full p-6 rounded-xl font-semibold text-center text-lg animate-in fade-in slide-in-from-bottom-4 duration-500",
                      feedback.type === "up"
                        ? "bg-green-100 text-green-800 border-2 border-green-300"
                        : "bg-red-100 text-red-800 border-2 border-red-300"
                    )}
                  >
                    {feedback.type === "up"
                      ? "✓ Positive feedback recorded! Thank you!"
                      : "✓ Negative feedback recorded! Thank you!"}
                  </div>
                )}
              </>
          </div>
        </div>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="mt-0">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
