import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import ErrorIllustration from "@/assets/illustration/Error_illustration.svg";

const privacyPolicy = () => {
  const { data: terms } = useCustomQuery("/core/web-views/privacy_policy/", [
    "termsAndConditions",
  ]);
  return (
    <>
      {terms ? (
        <main
          className="p-[50px]"
          dir="ltr"
          dangerouslySetInnerHTML={{ __html: terms.data.value }}
        />
      ) : (
        <div className="h-screen flex flex-col justify-center items-center">
          <img src={ErrorIllustration} className="h-80 w-80" alt="Error" />
          <h2 className="text-2xl">لا يوجد محتوى لعرضه</h2>
        </div>
      )}
    </>
  );
};
export default privacyPolicy;
