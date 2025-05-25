import LoginForm from "@/components/Auth/LoginForm";
import Navigation from "@/components/UI/Nav";
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0A0A20] flex items-center justify-center p-4">
      {/* Background elements */}
      <Navigation/>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] h-[300px] w-[300px] rounded-full bg-[#2563EB]/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[30%] right-[15%] h-[400px] w-[400px] rounded-full bg-[#EB2563]/20 blur-[100px] animate-pulse" />
        <div className="absolute top-[60%] left-[70%] h-[250px] w-[250px] rounded-full bg-[#63EB25]/20 blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
