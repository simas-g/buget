import LoginForm from "@/components/Auth/LoginForm";
import Navigation from "@/components/UI/Nav";
export default function SignInPage() {
  const navLinks = [{ href: "/", label: "Pradžia" }];
  return (
    <div className="min-h-screen bg-[#0A0A20] flex items-center justify-center p-4">
      <Navigation navLinks={navLinks} />
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
