"use client";
import { ChartBar } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import Button from "../UI/Button";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import DialogWrapper from "@/components/UI/Dialog";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
export default function Categories({ categories = [], total }) {
  const [showAddCategory, setShowAddCategory] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const user = useSelector((state) => state.user);
  const newCategory = useRef();
  const calculatePercentage = (amount) => {
    return ((amount / total) * 100).toFixed(1);
  };
  const handleAddCategory = () => {
    setShowAddCategory(true);
  };
  const handleCancelCategory = () => {
    setError('')
    setShowAddCategory(false);
  };
  const handleSubmitCategory = async () => {
    const name = newCategory.current?.value.trim();
    if (!name) return;
    console.log(user, 'our selector')
    setLoading(true);
    try {
      const res = await fetch("/api/user/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          name,
        }),
      });

      if (res.ok) {
        setLoading(false);
        setShowAddCategory(false);
        return;
      } else {
        throw new Error();
      }
    } catch (error) {
      setLoading(false);
      setError("Įvyko klaida");
    }
  };
  async function fetchCategories() {
    
  }
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
  return (
    <BoxWrapper className={"relative w-full"}>
      {showAddCategory &&
        createPortal(
          <DialogWrapper open={showAddCategory} onClose={handleCancelCategory}>
            <div className="flex flex-col gap-2">
              <input
                ref={newCategory}
                type="text"
                placeholder="kategorija"
                className="border outline-none px-4 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400"
              />
              {error && <p className="text-accent">{error}</p>}
              <button
                onClick={handleSubmitCategory}
                disabled={loading}
                className="w-fit border px-4 py-2 rounded-lg cursor-pointer bg-primary"
              >
                Pridėti
              </button>
            </div>
          </DialogWrapper>,
          document.body
        )}
      <h5 className="flex items-center gap-2 text-xl font-bold">
        <ChartBar stroke="var(--color-secondary)" size={24} />
        Kategorijos
      </h5>
      <button
        onClick={handleAddCategory}
        className="flex absolute right-4 top-4 items-center space-x-2 rounded-lg bg-secondary px-4 py-2 text-white font-medium transition-all cursor-pointer duration-300"
      >
        <Plus className="h-4 w-4" />
        <span>Pridėti</span>
      </button>
      <ul className="mt-4 space-y-3">
        {sortedCategories.map((category) => (
          <li className="flex flex-col gap-2" key={category.color}>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 mr-2 rounded-full"
                style={{ backgroundColor: category.color }}
              ></span>
              {category.name}{" "}
              <span className="text-gray-400 text-xs">
                ({calculatePercentage(category.amount)}%)
              </span>
            </div>

            <div className="w-full relative h-2 rounded-full bg-white/10">
              <div
                style={{
                  width: `${calculatePercentage(category.amount)}%`,
                  backgroundColor: category.color,
                }}
                className="h-2 rounded-full"
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </BoxWrapper>
  );
}
