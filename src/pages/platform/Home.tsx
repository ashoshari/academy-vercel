import { useCustomQuery } from "@/hooks/useQuery";
import Hero from "@/components/platform/home/hero";
import AllCourses from "@/components/platform/courses/allCourses";
import EnrolledCourses from "@/components/platform/courses/enrolledCourses";

import Discover from "@/components/platform/home/discover";
import useTokenStore from "@/store/platform/useToken";

const Home = () => {
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);
  // const levelsData = useCustomQuery("core/levels/", ["levels"]);
  // if (levelsData.isLoading) return <div>Loading...</div>;
  // console.log("Levels Data:", levelsData.data);
  return (
    <>
      <Hero />
      {isLoggedIn && <EnrolledCourses />}
      <Discover/>
    </>
  );
};

export default Home;
