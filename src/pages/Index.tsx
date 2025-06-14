
// Main MVP Swiping Experience for Idea Tinder

import React, { useState } from "react";
import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";
import SwipeActions from "@/components/SwipeActions";
import PostIdeaModal from "@/components/PostIdeaModal";
import SavedIdeasModal from "@/components/SavedIdeasModal";
import { demoIdeas, Idea } from "@/data/demoIdeas";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  // Local state for MVP (replace with backend later)
  const [ideas, setIdeas] = useState<Idea[]>(demoIdeas);
  const [current, setCurrent] = useState(0);
  const [saved, setSaved] = useState<Idea[]>([]);
  const [showPost, setShowPost] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Super Like is limited in MVP to 1 per 24h (just once per session here)
  const [superUsed, setSuperUsed] = useState(false);

  const handleSwipe = (dir: "left" | "right" | "super") => {
    if (current >= ideas.length) return;
    const idea = ideas[current];
    if (dir === "right") {
      setSaved(prev => prev.some(i => i.id === idea.id) ? prev : [...prev, idea]);
      toast({ title: "Saved!", description: `You liked "${idea.title}"` });
    }
    if (dir === "super" && !superUsed) {
      setSaved(prev => prev.some(i => i.id === idea.id) ? prev : [...prev, idea]);
      setSuperUsed(true);
      toast({
        title: "Super Like!",
        description: `⚡ You super liked "${idea.title}". The author will be notified (just kidding).`
      });
    }
    setCurrent(cur => cur + 1);
  };

  const handleAddIdea = (data: { title: string; description: string; tags: string[]; stage: string }) => {
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      tags: data.tags,
      stage: data.stage as Idea["stage"],
      author: "You", // MVP placeholder
    };
    setIdeas(prev => [newIdea, ...prev]);
    setCurrent(0);
    toast({ title: "Your idea was posted!", description: "Get feedback and connections from the community." });
  };

  // Show no more cards screen if empty
  const noMore = current >= ideas.length;

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen flex flex-col">
      <Header onShowSaved={() => setShowSaved(true)} onShowPost={() => setShowPost(true)} />
      <main className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="flex flex-col items-center justify-center mt-8 w-full">
          <div className="h-[420px] flex items-center justify-center relative w-full max-w-lg">
            {noMore ? (
              <div className="rounded-2xl bg-white border border-dashed border-card shadow-inner p-10 text-center text-lg text-muted-foreground flex flex-col gap-2 items-center w-full">
                <span className="font-bold text-primary">You&apos;re caught up!</span>
                <span>Check back later or <button className="underline text-primary" onClick={() => setShowPost(true)}>post your own idea</button>.</span>
              </div>
            ) : (
              // Card stack effect (MVP: only top is interactive)
              ideas.slice(current, current + 2).map((idea, i) => (
                <div className="absolute w-full transition-all duration-200" key={idea.id} style={{ zIndex: 2 - i, top: `${i * 10}px`, left: `${i * 10}px` }}>
                  <IdeaCard
                    idea={idea}
                    isTop={i === 0}
                    onSwipeLeft={i === 0 ? () => handleSwipe("left") : undefined}
                    onSwipeRight={i === 0 ? () => handleSwipe("right") : undefined}
                    onSuperLike={i === 0 ? () => handleSwipe("super") : undefined}
                  />
                </div>
              ))
            )}
          </div>
          {!noMore && (
            <SwipeActions
              onLeft={() => handleSwipe("left")}
              onRight={() => handleSwipe("right")}
              onSuper={() => handleSwipe("super")}
              superDisabled={superUsed}
            />
          )}
        </div>
      </main>
      <PostIdeaModal open={showPost} onClose={() => setShowPost(false)} onSubmit={handleAddIdea} />
      <SavedIdeasModal open={showSaved} onClose={() => setShowSaved(false)} ideas={saved} />
    </div>
  );
};

export default Index;
