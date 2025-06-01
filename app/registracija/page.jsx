import SignUpForm from "@/components/Auth/SignupForm";
import Navigation from "@/components/UI/Nav";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0A0A20] flex items-center justify-center p-4">
      <Navigation />
      <div className="relative z-10 w-full max-w-md mt-18 sm:mt-0">
        <SignUpForm />
      </div>
    </div>
  );
}
