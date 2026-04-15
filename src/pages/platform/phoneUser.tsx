import EmptyState from "@/components/core/EmptyState";
import { Smartphone } from "lucide-react";
const PhoneUser = () => {
  return (
    <div className="min-h-screen flex content-center items-center">
      <EmptyState
        title="قم بتحميل التطبيق لتتمكن من مشاهدة الدورات"
        description="تجربة أفضل ومناسبة لشاشة الهاتف."
        icon={Smartphone}
        tone="info"
        size="md"
        className="mx-5"
      />
    </div>
  );
};
export default PhoneUser;
