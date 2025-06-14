
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (idea: {title: string; description: string; tags: string[]; stage: string}) => void;
}

const STAGES = ["Concept", "MVP", "Testing", "Scaling"];
const TAGS = ["Technology", "Business", "Social Impact", "Creative", "Education", "Sustainability"];

const PostIdeaModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [stage, setStage] = useState(STAGES[0]);
  const [tag, setTag] = useState(TAGS[0]);
  const [extraTags, setExtraTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;
    onSubmit({ title, description: desc, tags: [tag, ...extraTags], stage });
    setTitle(""); setDesc(""); setStage(STAGES[0]); setTag(TAGS[0]); setExtraTags([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Post a New Idea</DialogTitle>
            <DialogDescription>Bring your innovation to life! Describe your idea for instant feedback.</DialogDescription>
          </DialogHeader>
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required maxLength={60} />
          <textarea className="w-full border rounded px-3 py-2 resize-none" placeholder="Describe your idea..." value={desc} onChange={e => setDesc(e.target.value)} required minLength={20} maxLength={220} rows={4} />
          <div className="flex gap-3">
            <select className="border rounded px-3 py-2 flex-1" value={stage} onChange={e => setStage(e.target.value)}>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="border rounded px-3 py-2 flex-1" value={tag} onChange={e => setTag(e.target.value)}>
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input placeholder="Add extra tags (comma separated, optional)" value={extraTags.join(", ")} onChange={e => setExtraTags(e.target.value.split(/\s*,\s*/).filter(Boolean))} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Publish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostIdeaModal;
