import SignUpForm from "@/components/Auth/SignupForm";
import Navigation from "@/components/UI/Nav";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0A0A20] flex items-center justify-center p-4">
      <Navigation />
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] right-[10%] h-[350px] w-[350px] rounded-full bg-[#2563EB]/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[15%] h-[400px] w-[400px] rounded-full bg-[#EB2563]/20 blur-[100px] animate-pulse" />
        <div className="absolute top-[50%] left-[60%] h-[280px] w-[280px] rounded-full bg-[#63EB25]/20 blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md mt-18 sm:mt-0">
        <SignUpForm />
      </div>
    </div>
  );
}
