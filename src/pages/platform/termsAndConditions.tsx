import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
const termsAndConditions = () => {
  const { data: terms } = useCustomQuery(
    "/core/web-views/terms_and_conditions/",
    ["termsAndConditions"]
  );


  return <main className="p-[50px]" dir="ltr" dangerouslySetInnerHTML={{ __html: terms.data.value }} />;
};
export default termsAndConditions;
