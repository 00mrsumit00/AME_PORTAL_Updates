import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Power, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const fetchStaff = async () => {
    try { const r = await api.get("/branch/staff"); setStaff(r.data); }
    catch { toast.error("Failed to load staff"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchStaff(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) { toast.error("All fields required"); return; }
    setCreating(true);
    try {
      await api.post("/branch/staff", form);
      toast.success("Staff created");
      setShowCreate(false);
      setForm({ name: "", email: "", password: "" });
      fetchStaff();
    } catch (err) { toast.error(err.response?.data?.detail || "Failed"); }
    finally { setCreating(false); }
  };

  const toggleActive = async (s) => {
    try { await api.put(`/branch/staff/${s.id}?is_active=${!s.is_active}`); toast.success("Updated"); fetchStaff(); }
    catch { toast.error("Failed"); }
  };

  const deleteStaff = async (s) => {
    if (!window.confirm(`Delete staff "${s.name}"?`)) return;
    try { await api.delete(`/branch/staff/${s.id}`); toast.success("Deleted"); fetchStaff(); }
    catch { toast.error("Failed"); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6" data-testid="staff-management">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold tracking-tight">Staff Management</h2><p className="text-sm text-muted-foreground mt-1">{staff.length} staff members</p></div>
        <Button onClick={() => setShowCreate(true)} data-testid="create-staff-btn"><Plus className="w-4 h-4 mr-1"/>Add Staff</Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {staff.length === 0 ? (
            <div className="text-center py-16"><UserCog className="w-12 h-12 text-muted-foreground mx-auto mb-3"/><p className="text-muted-foreground">No staff members yet</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Name</TableHead><TableHead className="text-xs font-semibold">Email</TableHead><TableHead className="text-xs font-semibold">Status</TableHead><TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {staff.map(s => (
                  <TableRow key={s.id} className="border-border" data-testid={`staff-row-${s.id}`}>
                    <TableCell className="text-sm font-medium">{s.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.email}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-xs ${s.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{s.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toggleActive(s)} data-testid={`toggle-staff-${s.id}`}><Power className="w-4 h-4"/></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteStaff(s)} data-testid={`delete-staff-${s.id}`}><Trash2 className="w-4 h-4"/></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-card border-border max-w-md" data-testid="create-staff-dialog">
          <DialogHeader><DialogTitle>Add New Staff</DialogTitle><DialogDescription>Create login for branch staff member.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label className="text-sm">Name *</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" className="bg-background border-border" data-testid="staff-name-input"/></div>
            <div className="space-y-1.5"><Label className="text-sm">Email (Username) *</Label><Input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" placeholder="email@example.com" className="bg-background border-border" data-testid="staff-email-input"/></div>
            <div className="space-y-1.5"><Label className="text-sm">Password *</Label><Input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="Password" className="bg-background border-border" data-testid="staff-password-input"/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating} data-testid="confirm-create-staff-btn">{creating?<Loader2 className="w-4 h-4 animate-spin mr-1"/>:<Plus className="w-4 h-4 mr-1"/>}{creating?"Creating...":"Add Staff"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
