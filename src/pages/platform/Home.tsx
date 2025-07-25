import { useCustomQuery } from "@/hooks/useQuery";
import Hero from "@/components/platform/home/hero";
import Discover from "@/components/platform/home/discover";

const Home = () => {
  const levelsData = useCustomQuery("core/levels/", ["levels"]);
  if (levelsData.isLoading) return <div>Loading...</div>;
  console.log("Levels Data:", levelsData.data);
  return (
    <>
      <Hero />
      <Discover onSectionClick={(sectionTitle) => console.log(sectionTitle)} />
    </>
  );
};

export default Home;
