import { getModelsWithStats } from "@/app/actions/models";
import VotingInterface from "./components/voting-interface";
import PageHeader from "./components/page-header";
import PageNav from "./components/page-nav";

export default async function Home() {
  const models = await getModelsWithStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <PageHeader />
      <PageNav />

      <div className="px-8 pt-6">
        <VotingInterface models={models} />
      </div>
    </div>
  );
}
