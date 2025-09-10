import { useNavigate } from "react-router";

const usePreviousRoute = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Real browser back
    } else {
      navigate("/"); // Fallback
    }
  };

  return { goBack };
};

export default usePreviousRoute;