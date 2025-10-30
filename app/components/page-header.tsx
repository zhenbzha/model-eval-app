import { Sparkles } from "lucide-react";

export default function PageHeader() {
  return (
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
  );
}
