"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitVote } from "@/app/actions/evaluations";
import type { ModelWithStats } from "@/app/actions/models";

interface VotingInterfaceProps {
  models: ModelWithStats[];
}

export default function VotingInterface({ models }: VotingInterfaceProps) {
  const [selectedModel, setSelectedModel] = useState<number | null>(models[0]?.id || null);
  const [justVoted, setJustVoted] = useState<"up" | "down" | null>(null);

  const handleVote = async (type: "up" | "down") => {
    if (!selectedModel) return;

    try {
      const result = await submitVote(selectedModel, type === "up");

      if (result.success) {
        // Show checkmark feedback
        setJustVoted(type);
        setTimeout(() => setJustVoted(null), 1000);

        if (type === "up") {
          toast.success("Your feedback is recorded!", {
            description: "Thank you for your feedback on this model.",
          });
        } else {
          toast.success("Your feedback is recorded!", {
            description: "Thank you for your feedback. We'll work on improvements.",
          });
        }
      } else {
        toast.error("Failed to submit vote", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("Failed to submit vote", {
        description: "An unexpected error occurred.",
      });
    }
  };

  return (
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
                  "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Voting Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-4">
          {/* Thumbs Up Card */}
          <Card
            className="w-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-400 group"
            onClick={() => handleVote("up")}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  {justVoted === "up" ? (
                    <Check className="w-8 h-8 text-green-600 animate-in zoom-in duration-200" />
                  ) : (
                    <ThumbsUp className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-green-800">Good Performance</h3>
                <p className="text-sm text-green-700">Model is performing as expected</p>
              </div>
            </CardContent>
          </Card>

          {/* Thumbs Down Card */}
          <Card
            className="w-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-400 group"
            onClick={() => handleVote("down")}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  {justVoted === "down" ? (
                    <Check className="w-8 h-8 text-red-600 animate-in zoom-in duration-200" />
                  ) : (
                    <ThumbsDown className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-red-800">Poor Performance</h3>
                <p className="text-sm text-red-700">Model needs improvement</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
