import { useCustomQuery } from "@/hooks/useQuery";
import { useEffect } from "react";
const termsAndConditions = () => {
  const { data: terms, isLoading } = useCustomQuery(
    "/core/web-views/terms_and_conditions/",
    ["termsAndConditions"]
  );
  useEffect(() => {
    if (isLoading) {
      console.log("loading");
    } else if (terms) {
      console.log("terms:", terms.data.value);
      // You can also log specific values like:
    }
  }, [isLoading, terms]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الشروط والأحكام...</p>
        </div>
      </div>
    );
  }

  if (!terms?.data?.value) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            خطأ في تحميل المحتوى
          </h2>
          <p className="text-gray-600">لم يتم العثور على الشروط والأحكام</p>
        </div>
      </div>
    );
  }
  return <main className="p-[50px]" dir="ltr" dangerouslySetInnerHTML={{ __html: terms.data.value }} />;
};
export default termsAndConditions;
