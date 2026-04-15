import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import { ArrowRight } from "lucide-react";
import EmptyState from "@/components/core/EmptyState";
import { useNavigate } from "react-router";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { data: terms } = useCustomQuery("/core/web-views/privacy_policy/", [
    "termsAndConditions",
  ]);
  return (
    <>
      {terms ? (
        <>
          <div className="flex items-center mb-6 gap-x-1.25 p-8">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate(-1);
                }
              }}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">سياسة الخصوصية</h2>
          </div>
          <main
            className="px-10"
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: terms.data.value }}
          />
        </>
      ) : (
        <EmptyState title="لا يوجد محتوى لعرضه" tone="info" fullHeight />
      )}
    </>
  );
};
export default PrivacyPolicy;
