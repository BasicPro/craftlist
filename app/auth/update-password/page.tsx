import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { CenteredContainer } from "@/components/ui/layout";

export default function Page() {
  return (
    <CenteredContainer className="p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </CenteredContainer>
  );
}
