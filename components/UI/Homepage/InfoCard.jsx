import {
  Check,
  CheckCircle,
  Download,
  GitGraph,
  Info,
  Shield,
  Tag,
} from "lucide-react";

const Icons = {
  Shield: Shield,
  Download: Download,
  GitGraph: GitGraph,
  Tag: Tag,
};
export default function InfoCard({ title, description, icon, list, id }) {
  const IconComponent = Icons[icon];
  const gradientColor =
    icon === "Shield"
      ? "from-secondary to-accent"
      : icon === "Download"
      ? "from-primary to-secondary "
      : "from-accent to-primary";
  return (
    <div className="relative hover:-translate-y-2 shadow-xl w-full duration-300 rounded-lg text-white border border-gray-600 after:backdrop-blur-2xl after:absolute after:-inset-1 after:bg-secondary/60 after:z-0 after:blur-sm after:rounded-lg">
      {/* Content wrapper with higher z-index */}
      <div className="relative z-10 bg-[#1A1A40] p-4 rounded-md  space-y-3 h-full">
        <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
          {id + 1}
        </span>
        <div
          className={`bg-gradient-to-br w-fit rounded-xl p-2 ${gradientColor}`}
        >
          {IconComponent && <IconComponent size={32} />}
        </div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-sm text-gray-300 mb-4">{description}</p>
        <ul className="space-y-2">
          {list.map((item, index) => (
            <li className="flex items-center text-xs text-gray-300" key={index}>
              <CheckCircle
                className="inline-block mr-2 text-green-500"
                size={16}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
