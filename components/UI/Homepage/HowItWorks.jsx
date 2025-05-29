import {
  Check,
  CircleCheck,
  Download,
  GitGraph,
  Info,
  Shield,
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";
import InfoCard from "./InfoCard";
const steps = [
  {
    title: "Prisijunk prie savo banko",
    description:
      "Susiek savo banko sąskaitą su GoCardless - Europos lyderio mokėjimų srityje.",
    icon: "Shield",
    list: [
      "Saugus ir patikimas prisijungimas",
      "PSD2 sertifikuotas",
      "Greitas ir paprastas procesas",
    ],
  },
  {
    title: "Automatinis operacijų importas",
    description:
      "Visi tavo mokėjimai bus automatiškai importuojami į mūsų sistemą.",
    icon: "Download",
    list: [
      "Duomenų sinchronizavimas realiu laiku",
      "Automatinis duomenų atnaujinimas",
    ],
  },
  {
    title: "Išmanus kategorizavimas",
    description:
      "Susikurk kategorijas ir priskirk prie jų visas savo banko operacijas.",
    icon: "Tag",
    list: [
      "Individualios kategorijos",
      "Galimybė išskaidyti operacijas į kelias kategorijas",
    ],
  },
  {
    title: "Mėnesio analizė",
    description:
      "Mėnesio pabaigoje gauk išsamią skaitinę ir grafinę pinigų srauto analizę su DI įžvalgomis.",
    icon: "GitGraph",
    list: ["Grafinė analizė", "Išlaidų tendencijos", "DI įžvalgos"],
  },
];
export default function HowItWorks() {
  return (
    <section
      
      className="w-full text-white flex-col flex h-auto items-center justify-center"
    >
      <h2 className=" text-center font-bold sm:text-4xl text-2xl">
        Kaip viskas veikia?
      </h2>
      <div className="flex flex-col justify-center gap-y-2">
        <p className="text-gray-400 text-center">
          Štai kaip automatizuojam visus tavo finansus.
        </p>
        {/**GOCARDLESS integration*/}
        <div className="w-fit hidden sm:flex border-gray-400 relative p-4 gap-x-4 flex-wrap items-center justify-center gap-1 backdrop:blur-xl rounded-xl">
          <div className="px-3 py-2 rounded-md bg-white text-black font-bold w-fit">
            <span>GoCardless</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={32} stroke="var(--color-secondary)" />
            <span>Saugus prijungimas prie banko</span>
          </div>
          <div className="sm:flex items-center gap-1 hidden">
            <CircleCheck size={32} stroke="var(--color-primary)" />
            <span>PSD2 sertifikuotas</span>
          </div>
        </div>
      </div>

      {/** Steps */}
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-8 sm:px-10 sm:gap-6 mt-10 pb-10 relative">
        {steps.map((step, index) => (
          <InfoCard {...step} id={index} key={step.title} />
        ))}
      </div>
    </section>
  );
}
