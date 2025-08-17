import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";

const privacyPolicy = () => {
  const { data: terms } = useCustomQuery("/core/web-views/privacy_policy/", [
    "termsAndConditions",
  ]);

  return (
    <main
      className="p-[50px]"
      dir="ltr"
      dangerouslySetInnerHTML={{ __html: terms.data.value }}
    />
  );
};
export default privacyPolicy;
