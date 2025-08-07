import Hero from "@/components/platform/home/hero";
import EnrolledCourses from "@/components/platform/courses/enrolledCourses";

import Discover from "@/components/platform/home/discover";
import useTokenStore from "@/store/platform/useToken";

const Home = () => {
  const isLoggedIn = useTokenStore((state) => state.isLoggedIn);
  return (
    <>
      <Hero />
      {isLoggedIn && <EnrolledCourses />}
      <Discover/>
    </>
  );
};

export default Home;
