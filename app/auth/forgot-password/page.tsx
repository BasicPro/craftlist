import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { CenteredContainer } from "@/components/ui/layout";

export default function Page() {
  return (
    <CenteredContainer className="p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </CenteredContainer>
  );
}
