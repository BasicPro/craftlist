import { LoginForm } from "@/components/auth/login-form";
import { CenteredContainer } from "@/components/ui/layout";

export default function Page() {
  return (
    <CenteredContainer className="p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </CenteredContainer>
  );
}
