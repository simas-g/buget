import SignUpForm from "@/components/Auth/SignupForm";
import Navigation from "@/components/UI/Nav";
import AuthPageWrapper from "@/components/Auth/AuthPageWrapper";

export default function SignUpPage() {
  const navLinks = [
    { href: "/", label: "Pradžia" },
  ]
  return (
    <AuthPageWrapper>
      <Navigation navLinks={navLinks}/>
      <div className="relative z-10 w-full max-w-md mt-18 sm:mt-0">
        <SignUpForm />
      </div>
    </AuthPageWrapper>
  );
}
