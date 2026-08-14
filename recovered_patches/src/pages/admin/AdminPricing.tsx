import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPricingPackets, addPricingPacket, updatePricingPacket, deletePricingPacket } from "@/lib/db";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminPricing = () => {
  const queryClient = useQueryClient();
  const { data: packets = [], isLoading } = useQuery({
    queryKey: ['pricing_packets'],
    queryFn: getPricingPackets
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialForm = {
    id: '', name: '', tagline: '', base_price: 0, base_videos: 1, base_reels: 0,
    video_max_min: 5, video_style: '', reel_style: '', extra_video_price: 0,
    extra_reel_price: 0, extra_minute_price: 0, max_reels: 0, exclusive: false,
    best_for: '', reference_url: '', featured: false, delivery: '', sort_order: 0
  };
  const [formData, setFormData] = useState(initialForm);

  const addMutation = useMutation({
    mutationFn: addPricingPacket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing_packets'] });
      setIsOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: any }) => updatePricingPacket(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing_packets'] });
      setIsOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deletePricingPacket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pricing_packets'] })
  });

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      id: p.id, name: p.name, tagline: p.tagline, base_price: p.base_price || 0,
      base_videos: p.base_videos, base_reels: p.base_reels, video_max_min: p.video_max_min,
      video_style: p.video_style, reel_style: p.reel_style, extra_video_price: p.extra_video_price,
      extra_reel_price: p.extra_reel_price, extra_minute_price: p.extra_minute_price,
      max_reels: p.max_reels || 0, exclusive: p.exclusive, best_for: p.best_for,
      reference_url: p.reference_url, featured: p.featured, delivery: p.delivery || '', sort_order: p.sort_order
    });
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      base_price: formData.base_price === 0 ? null : formData.base_price,
      max_reels: formData.max_reels === 0 ? null : formData.max_reels,
      delivery: formData.delivery === '' ? null : formData.delivery
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pricing Packets</h1>
          <p className="text-muted-foreground mt-2">Manage your pricing plans and features.</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Packet
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Pricing Packet' : 'Add Pricing Packet'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ID (e.g., starter)</label>
                <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} disabled={!!editingId} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Price (0=Custom)</label>
                <input type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.base_price} onChange={e => setFormData({...formData, base_price: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Videos</label>
                <input type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.base_videos} onChange={e => setFormData({...formData, base_videos: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Reels</label>
                <input type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.base_reels} onChange={e => setFormData({...formData, base_reels: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Style</label>
                <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.video_style} onChange={e => setFormData({...formData, video_style: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reel Style</label>
                <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.reel_style} onChange={e => setFormData({...formData, reel_style: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Extra Video (Tk)</label>
                <input type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.extra_video_price} onChange={e => setFormData({...formData, extra_video_price: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Extra Reel (Tk)</label>
                <input type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.extra_reel_price} onChange={e => setFormData({...formData, extra_reel_price: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Extra Min (Tk)</label>
                <input type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.extra_minute_price} onChange={e => setFormData({...formData, extra_minute_price: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Min/Video</label>
                <input type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.video_max_min} onChange={e => setFormData({...formData, video_max_min: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Reels (0=No limit)</label>
                <input type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.max_reels} onChange={e => setFormData({...formData, max_reels: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <input type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                  value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Best For</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.best_for} onChange={e => setFormData({...formData, best_for: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reference URL</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.reference_url} onChange={e => setFormData({...formData, reference_url: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery text</label>
              <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.delivery} onChange={e => setFormData({...formData, delivery: e.target.value})} />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input type="checkbox" checked={formData.exclusive} onChange={e => setFormData({...formData, exclusive: e.target.checked})} className="rounded bg-background border-border" />
                Exclusive (Video OR Reels)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded bg-background border-border" />
                Featured (Most Popular)
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading pricing...</div>
        ) : packets.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No pricing packets found.</div>
        ) : (
          <div className="divide-y divide-border">
            {packets.map((p: any, index: number) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <h4 className="font-medium">{p.name} {p.featured && <span className="ml-2 text-xs text-primary">(Featured)</span>}</h4>
                  <p className="text-sm text-muted-foreground">{p.base_price ? `${p.base_price} tk` : "Custom Price"}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col gap-0 mr-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      disabled={index === 0}
                      onClick={() => {
                        const prevPacket = packets[index - 1];
                        updateMutation.mutate({ id: p.id, payload: { ...p, sort_order: prevPacket.sort_order } });
                        updateMutation.mutate({ id: prevPacket.id, payload: { ...prevPacket, sort_order: p.sort_order } });
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      disabled={index === packets.length - 1}
                      onClick={() => {
                        const nextPacket = packets[index + 1];
                        updateMutation.mutate({ id: p.id, payload: { ...p, sort_order: nextPacket.sort_order } });
                        updateMutation.mutate({ id: nextPacket.id, payload: { ...nextPacket, sort_order: p.sort_order } });
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.14645 12.8536C7.34171 13.0488 7.65829 13.0488 7.85355 12.8536L11.8536 8.85355C12.0488 8.65829 12.0488 8.34171 11.8536 8.14645C11.6583 7.95118 11.3417 7.95118 11.1464 8.14645L8 11.2929L8 2.5C8 2.22386 7.77614 2 7.5 2C7.22386 2 7 2.22386 7 2.5L7 11.2929L3.85355 8.14645C3.65829 7.95118 3.34171 7.95118 3.14645 8.14645C2.95118 8.34171 2.95118 8.65829 3.14645 8.85355L7.14645 12.8536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (window.confirm('Are you sure?')) deleteMutation.mutate(p.id);
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPricing;