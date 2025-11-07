import Button from "@/components/UI/Button";
import DialogWrapper from "@/components/UI/Dialog";
import { forwardRef } from "react";

export const CreationModal = forwardRef(({ onCreate, ...props }, ref) => {
  return (
    <DialogWrapper {...props}>
      <div className="flex flex-col gap-2 items-end">
        <input
          ref={ref}
          type="text"
          placeholder="kategorija"
          className="border bg-white outline-none px-4 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400"
        />
        <button
          onClick={onCreate}
          className="w-fit border px-4 py-2 rounded-lg cursor-pointer bg-[#63EB25]"
        >
          Pridėti
        </button>
      </div>
    </DialogWrapper>
  );
});
export function DeletionModal({ open, onClose, onDelete }) {
  return (
    <DialogWrapper
      onClose={onClose}
      open={open}
      className="flex flex-col gap-3"
    >
      <p>Ar tikrai nori ištrinti šią kategoriją?</p>
      <div className="flex gap-2 w-full justify-end">
        <Button onClick={onClose} className={"px-2 py-1 underline"}>
          Ne
        </Button>
        <Button
          onClick={async () => onDelete()}
          className="bg-[#63EB25] border px-3 py-1"
        >
          Taip
        </Button>
      </div>
    </DialogWrapper>
  );
}
