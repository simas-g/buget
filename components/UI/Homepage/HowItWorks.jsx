import { Check, CircleCheck, Shield } from "lucide-react";
export default function HowItWorks() {
  return (
    <section className="w-full text-white flex-col flex h-auto items-center justify-center">
      <h2 className=" text-center font-bold sm:text-4xl text-2xl">Kaip viskas veikia?</h2>
      <div className="flex flex-col justify-center gap-y-2">
        <p className="text-gray-400 text-center">
          Štai kaip automatizuojam visus tavo finansus.
        </p>
        {/**GOCARDLESS integration*/}
        <div className="w-full border-[0.5px] border-gray-400 relative p-4 gap-x-4 bg-[#1A1A40]/70 flex flex-wrap items-center justify-center gap-1 backdrop:blur-xl rounded-xl">
          <div className="px-3 py-2 rounded-md bg-white text-black font-bold w-fit">
            <span>GoCardless</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={32} stroke="var(--color-secondary)"/>
            <span>Saugus prijungimas prie banko</span>
          </div>
          <div className="sm:flex items-center gap-1 hidden">
            <CircleCheck size={32} stroke="var(--color-primary)" />
            <span>PSD2 sertifikuotas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
