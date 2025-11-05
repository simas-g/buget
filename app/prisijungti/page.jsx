import LoginForm from "@/components/Auth/LoginForm";
import Navigation from "@/components/UI/Nav";
import AuthPageWrapper from "@/components/Auth/AuthPageWrapper";

export default function SignInPage() {
  const navLinks = [{ href: "/", label: "Pradžia" }];
  return (
    <AuthPageWrapper>
      <Navigation navLinks={navLinks} />
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </AuthPageWrapper>
  );
}
