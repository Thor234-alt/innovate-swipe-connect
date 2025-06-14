
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import React from "react";

interface Props {
  onLeft: () => void;
  onRight: () => void;
  onSuper: () => void;
  superDisabled?: boolean;
}

const SwipeActions: React.FC<Props> = ({ onLeft, onRight, onSuper, superDisabled }) => (
  <div className="flex justify-center gap-8 pt-4">
    <button onClick={onLeft} aria-label="Pass" className="bg-destructive/10 text-destructive rounded-full p-4 hover:bg-destructive/20 shadow transition">
      <ChevronLeft className="h-7 w-7" />
    </button>
    <button onClick={onSuper} aria-label="Super Like" className={`bg-primary/10 text-primary rounded-full p-4 hover:bg-primary/20 shadow transition ${superDisabled ? "opacity-40 cursor-not-allowed" : ""}`} disabled={superDisabled}>
      <Star className="h-7 w-7" />
    </button>
    <button onClick={onRight} aria-label="Like" className="bg-green-100 text-green-700 rounded-full p-4 hover:bg-green-200 shadow transition">
      <ChevronRight className="h-7 w-7" />
    </button>
  </div>
);

export default SwipeActions;
