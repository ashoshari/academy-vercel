import errorIllustration from "../../assets/illustration/Error_illustration.svg";
const PhoneUser = () => {
  return (
    <div className="mx-5 relative flex flex-col items-center">
      <img
        className="absolute top-0 w-75 h-162.5 z-0"
        src={errorIllustration}
        alt="error"
      />
      <h1 className="pt-0 text-center absolute text-[1rem] top-112.5 z-1">
        قم بتحميل التطبيق لتتمكن من مشاهدة الدورات{" "}
      </h1>
    </div>
  );
};
export default PhoneUser;
