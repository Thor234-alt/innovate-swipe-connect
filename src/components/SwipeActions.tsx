
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import React from "react";

interface Props {
  onLeft: () => void;
  onRight: () => void;
  onSuper: () => void;
  superDisabled?: boolean;
}

const SwipeActions: React.FC<Props> = ({ onLeft, onRight, onSuper, superDisabled }) => (
  <div className="flex justify-center items-center gap-4 sm:gap-8 px-2 sm:px-4">
    <button 
      onClick={onLeft} 
      aria-label="Pass" 
      className="bg-destructive/10 text-destructive rounded-full p-3 sm:p-4 hover:bg-destructive/20 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7" />
    </button>
    <button 
      onClick={onSuper} 
      aria-label="Super Like" 
      className={`bg-primary/10 text-primary rounded-full p-3 sm:p-4 hover:bg-primary/20 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${superDisabled ? "opacity-40 cursor-not-allowed" : ""}`} 
      disabled={superDisabled}
    >
      <Star className="h-5 w-5 sm:h-7 sm:w-7" />
    </button>
    <button 
      onClick={onRight} 
      aria-label="Like" 
      className="bg-green-100 text-green-700 rounded-full p-3 sm:p-4 hover:bg-green-200 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7" />
    </button>
  </div>
);

export default SwipeActions;
