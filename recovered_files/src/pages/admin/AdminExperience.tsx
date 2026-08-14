import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminExperience = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground mt-2">
            Add or edit your work history and professional journey.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Experience
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-8 text-center text-muted-foreground">
          <p>No database connected yet. This is where your experience entries will be listed.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminExperience;