import TreePage from "@/components/platform/courses/treePage";
import useNav from "@/store/platform/useNav";
const Courses = () => {
  const navHeader = useNav(state => state.navHeader);
  return (
    <>
      <TreePage sectionTitle={navHeader} />
    </>
  );
};
export default Courses;
