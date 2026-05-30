import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Plus, Loader2, Power, Trash2, MapPin, Phone, Users } from "lucide-react";
import { toast } from "sonner";

export default function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", contact_number: "", head_name: "", head_email: "", head_password: "" });

  const fetchBranches = async () => {
    try {
      const res = await api.get("/admin/branches");
      setBranches(res.data);
    } catch { toast.error("Failed to load branches"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBranches(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.head_email || !form.head_password) {
      toast.error("Name, head email, and password are required");
      return;
    }
    setCreating(true);
    try {
      await api.post("/admin/branches", form);
      toast.success("Branch created successfully");
      setShowCreate(false);
      setForm({ name: "", location: "", contact_number: "", head_name: "", head_email: "", head_password: "" });
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create");
    } finally { setCreating(false); }
  };

  const toggleActive = async (branch) => {
    try {
      await api.put(`/admin/branches/${branch.id}`, { is_active: !branch.is_active });
      toast.success(`Branch ${branch.is_active ? "deactivated" : "activated"}`);
      fetchBranches();
    } catch { toast.error("Failed to update"); }
  };

  const deleteBranch = async (branch) => {
    if (!window.confirm(`Delete branch "${branch.name}"? This will delete all associated data.`)) return;
    try {
      await api.delete(`/admin/branches/${branch.id}`);
      toast.success("Branch deleted");
      fetchBranches();
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6" data-testid="branch-management">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Branch Management</h2>
          <p className="text-sm text-muted-foreground mt-1">{branches.length} branches</p>
        </div>
        <Button 
          onClick={() => setShowCreate(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          data-testid="create-branch-btn"
        >
          <Plus className="w-4 h-4 mr-1" /> Create Branch
        </Button>
      </div>

      {/* Branch cards (mobile) / table (desktop) */}
      <div className="block md:hidden space-y-3">
        {branches.map((b) => (
          <Card key={b.id} className="border-border bg-card" data-testid={`branch-card-${b.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{b.location || "—"}</p>
                </div>
                <Badge variant="outline" className={b.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                  {b.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.student_count} students</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{b.contact_number || "—"}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toggleActive(b)}>
                  <Power className="w-3 h-3 mr-1" /> {b.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => deleteBranch(b)} data-testid={`delete-branch-${b.id}`}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Branch</TableHead>
                  <TableHead className="text-xs font-semibold">Location</TableHead>
                  <TableHead className="text-xs font-semibold">Head</TableHead>
                  <TableHead className="text-xs font-semibold">Students</TableHead>
                  <TableHead className="text-xs font-semibold">Staff</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((b) => (
                  <TableRow key={b.id} className="border-border" data-testid={`branch-row-${b.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="w-4 h-4 text-primary" /></div>
                        <span className="text-sm font-medium">{b.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{b.location || "—"}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{b.head_name}</p>
                      <p className="text-xs text-muted-foreground">{b.head_email}</p>
                    </TableCell>
                    <TableCell className="text-sm">{b.student_count}</TableCell>
                    <TableCell className="text-sm">{b.staff_count}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${b.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                        {b.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toggleActive(b)} data-testid={`toggle-branch-${b.id}`}>
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteBranch(b)} data-testid={`delete-branch-${b.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {branches.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-6">No branches created yet</p>
              <Button 
                variant="outline" 
                onClick={() => setShowCreate(true)}
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Your First Branch
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-card border-border max-w-lg" data-testid="create-branch-dialog">
          <DialogHeader>
            <DialogTitle>Create New Branch</DialogTitle>
            <DialogDescription>Fill in the details to create a new branch and its head account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Branch Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Branch name" className="bg-background border-border" data-testid="branch-name-input" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City/Location" className="bg-background border-border" data-testid="branch-location-input" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Contact Number</Label>
              <Input value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} placeholder="Phone number" className="bg-background border-border" data-testid="branch-contact-input" />
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium mb-3">Branch Head Account</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Head Name *</Label>
                  <Input value={form.head_name} onChange={(e) => setForm({ ...form, head_name: e.target.value })} placeholder="Full name" className="bg-background border-border" data-testid="head-name-input" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Head Email *</Label>
                  <Input value={form.head_email} onChange={(e) => setForm({ ...form, head_email: e.target.value })} type="email" placeholder="email@example.com" className="bg-background border-border" data-testid="head-email-input" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Head Password *</Label>
                  <Input value={form.head_password} onChange={(e) => setForm({ ...form, head_password: e.target.value })} type="password" placeholder="Secure password" className="bg-background border-border" data-testid="head-password-input" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)} data-testid="cancel-create-btn">Cancel</Button>
            <Button onClick={handleCreate} disabled={creating} data-testid="confirm-create-branch-btn">
              {creating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
              {creating ? "Creating..." : "Create Branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
