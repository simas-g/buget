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

  return (
    <div className="bg-gray-900 p-4 rounded-lg text-white space-y-2 max-w-80">
      <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
        {id + 1}
      </span>
      {IconComponent && <IconComponent size={32} />}
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-sm text-gray-300">{description}</p>
      <ul>
        {list.map((item, index) => (
          <li className="flex items-center text-sm text-gray-200" key={index}>
            <CheckCircle
              className="inline-block mr-2 text-green-500"
              size={16}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
