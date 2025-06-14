
import { useAuthUser } from "@/hooks/useAuthUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthUser();

  if (!user) {
    return <div className="p-8 text-center">No user details found.</div>;
  }

  return (
    <div className="flex justify-center items-start min-h-[60vh] py-12 px-2">
      <Card className="max-w-xl w-full bg-white/90 shadow-2xl border-primary/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-0">
          <User className="w-12 h-12 text-primary bg-primary/10 rounded-full p-2" />
          <div>
            <CardTitle className="mb-0">Profile</CardTitle>
            <div className="font-normal text-muted-foreground text-sm">Your account details</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div>
            <span className="text-xs text-muted-foreground block">Email</span>
            <div className="font-bold">{user.email}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">User ID</span>
            <div className="font-mono break-all">{user.id}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
