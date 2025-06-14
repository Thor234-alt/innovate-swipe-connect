
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IdeaCard from "./IdeaCard";
import { Idea } from "@/data/demoIdeas";

interface Props {
  open: boolean;
  onClose: () => void;
  ideas: Idea[];
}

const SavedIdeasModal: React.FC<Props> = ({ open, onClose, ideas }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="min-w-[360px] max-w-2xl">
      <DialogHeader>
        <DialogTitle>Saved Ideas</DialogTitle>
      </DialogHeader>
      {ideas.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          You haven&apos;t saved any ideas yet.<br />
          Swipe right to start building your collection!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 max-h-[60vh] overflow-y-auto">
          {ideas.map(idea => (
            <div key={idea.id}>
              <IdeaCard idea={idea} />
            </div>
          ))}
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default SavedIdeasModal;
