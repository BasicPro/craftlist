import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10 min-h-[calc(100vh-164px)]">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
