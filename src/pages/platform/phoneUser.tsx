import EmptyState from "@/components/core/EmptyState";
const PhoneUser = () => {
  return (
    <div className="min-h-screen flex content-center items-center">
      <EmptyState
        title="قم بتحميل التطبيق لتتمكن من مشاهدة الدورات"
        description="تجربة أفضل ومناسبة لشاشة الهاتف."
        tone="info"
        size="md"
        className="mx-5"
      />
    </div>
  );
};
export default PhoneUser;
