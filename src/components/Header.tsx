
import { User, BookOpen } from "lucide-react";

const Header = ({ onShowSaved, onShowPost }: { onShowSaved: () => void; onShowPost: () => void }) => (
  <header className="flex justify-between items-center py-4 px-8 bg-white border-b border-border sticky top-0 z-20 shadow-sm">
    <div className="flex items-center gap-2 text-2xl font-black tracking-tight select-none">
      <BookOpen className="w-7 h-7 text-primary" />
      <span>Idea Tinder</span>
      <span className="ml-2 text-xs font-semibold bg-primary/10 px-2 py-1 rounded text-primary">MVP</span>
    </div>
    <div className="flex items-center gap-4">
      <button
        className="font-medium text-sm px-4 py-2 hover:bg-secondary transition rounded"
        onClick={onShowPost}
      >
        + Post Idea
      </button>
      <button
        className="font-medium text-sm px-4 py-2 hover:bg-secondary transition rounded"
        onClick={onShowSaved}
      >
        Saved
      </button>
      <button className="p-2 rounded bg-muted/30 hover:bg-muted/60 transition" tabIndex={-1}>
        <User className="w-6 h-6 text-muted-foreground" />
      </button>
    </div>
  </header>
);

export default Header;
