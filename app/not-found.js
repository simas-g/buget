import Button from "@/components/UI/Button";
import Navigation from "@/components/UI/Nav";
import Link from "next/link";

export default function NotFound() {
  const navLinks = [{ href: "/", label: "Pradžia" }];
  return (
    <div className="min-h-screen bg-[#0A0A20] flex items-center justify-center p-4">
      <Navigation navLinks={navLinks} />
      <div className="relative z-10 w-full  max-w-md flex flex-col items-center gap-y-4">
        <h1 className="text-4xl font-bold text-center text-white">
          Puslapis nerastas
        </h1>
        <Link href="/">
          <Button variant="outline" className="px-4 py-2">
            Grįžti į pagrindinį puslapį
          </Button>
        </Link>
      </div>
    </div>
  );
}
