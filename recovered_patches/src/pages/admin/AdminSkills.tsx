import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminSkills = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tools, software expertise, and professional skills.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-8 text-center text-muted-foreground">
          <p>No database connected yet. This is where your skills will be listed.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;