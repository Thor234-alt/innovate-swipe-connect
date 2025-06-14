
import { Idea } from "@/data/demoIdeas";
import { ChevronRight, ChevronLeft, Heart, Star, User } from "lucide-react";
import React from "react";

type Props = {
  idea: Idea;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSuperLike?: () => void;
  style?: React.CSSProperties;
  isTop?: boolean;
};

const stageColor = {
  Concept: "bg-gray-100 text-gray-700",
  MVP: "bg-blue-100 text-blue-700",
  Testing: "bg-yellow-100 text-yellow-700",
  Scaling: "bg-green-100 text-green-700",
};

const IdeaCard: React.FC<Props> = ({
  idea,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  style,
  isTop,
}) => {
  // For basic animation, use isTop. Swipe logic will be in parent.
  return (
    <div
      className={`w-[340px] md:w-[380px] lg:w-[440px] max-w-full mx-auto bg-white rounded-2xl shadow-2xl border border-border p-6 pb-4 relative select-none transition-shadow
      ${isTop ? "hover:shadow-3xl hover:-translate-y-0.5" : "opacity-80 scale-95"}`}
      style={style}
      tabIndex={0}
      aria-label={`Idea: ${idea.title}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {idea.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-accent text-xs rounded-full font-semibold text-accent-foreground">{tag}</span>
        ))}
        <span className={`px-2 py-1 rounded-full text-xs font-bold ml-auto ${stageColor[idea.stage]}`}>{idea.stage}</span>
      </div>
      <h2 className="text-lg sm:text-xl font-bold mb-2">{idea.title}</h2>
      <p className="text-muted-foreground mb-6">{idea.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-4 w-4" /> {idea.author}
        </span>
        <div className="flex gap-2">
          <button
            className="p-2 rounded-full hover:bg-destructive/10 transition"
            aria-label="Pass"
            tabIndex={-1}
            onClick={onSwipeLeft}
          >
            <ChevronLeft className="text-destructive h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-green-100 transition"
            aria-label="Like"
            tabIndex={-1}
            onClick={onSwipeRight}
          >
            <ChevronRight className="text-green-700 h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-primary/10 transition"
            aria-label="Super Like"
            tabIndex={-1}
            onClick={onSuperLike}
          >
            <Star className="text-primary h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
