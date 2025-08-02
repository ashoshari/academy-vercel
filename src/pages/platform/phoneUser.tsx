import errorIllustration from "../../assets/illustration/Error_illustration.svg";
const PhoneUser = () => {
  return (
    <div className="mx-[20px] relative flex flex-col items-center">
      <img
        className="absolute top-0 w-[300px] h-[650px] z-0"
        src={errorIllustration}
        alt="error"
      />
      <h1 className="pt-[0px] text-center absolute text-[1rem] top-[450px] z-[1]">
        قم بتحميل التطبيق لتتمكن من مشاهدة الدورات{" "}
      </h1>
    </div>
  );
};
export default PhoneUser;
