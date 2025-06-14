
import { useAuthUser } from "@/hooks/useAuthUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Helper to get display name sensibly
function getDisplayName(user: any) {
  const meta = user?.user_metadata || {};
  return meta.name || meta.full_name || (user.email ? user.email.split("@")[0] : "User");
}

// Helper to get avatar image, prefer user's photo, else fallback
function getAvatarUrl(user: any) {
  const meta = user?.user_metadata || {};
  if (meta.avatar_url) return meta.avatar_url;
  // Unsplash placeholder fallback
  return "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2";
}

export default function ProfilePage() {
  const { user } = useAuthUser();

  if (!user) {
    return <div className="p-8 text-center">No user details found.</div>;
  }

  const displayName = getDisplayName(user);
  const avatarUrl = getAvatarUrl(user);

  return (
    <div className="flex justify-center items-start min-h-[60vh] py-12 px-2">
      <Card className="max-w-xl w-full bg-white/90 shadow-2xl border-primary/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-0">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatarUrl} alt={displayName ?? "Profile"} />
            <AvatarFallback>
              {displayName
                .split(" ")
                .map((s: string) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="mb-0">{displayName}</CardTitle>
            <div className="font-normal text-muted-foreground text-sm">Your account details</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div>
            <span className="text-xs text-muted-foreground block">Email</span>
            <div className="font-bold">{user.email}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
