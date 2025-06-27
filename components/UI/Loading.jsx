import { div } from "motion/react-client";

export default function Loading() {
  return (
    <div className="w-full flex justify-center">
      <div className="border-t border-2 w-10 h-10 border-secondary rounded-full animate-spin"></div>
    </div>
  );
}
