import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
const termsAndConditions = () => {
  const { data: terms } = useCustomQuery(
    "/core/web-views/terms_and_conditions/",
    ["termsAndConditions"]
  );


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
