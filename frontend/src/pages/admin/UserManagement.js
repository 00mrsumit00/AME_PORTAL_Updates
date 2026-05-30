import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Edit2, ShieldCheck, ShieldAlert, Key, Trash2, Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", is_active: true });
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredUsers(users.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    ));
  }, [searchTerm, users]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setForm({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      is_active: user.is_active 
    });
    setShowEdit(true);
  };

  const handlePasswordClick = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setShowPassword(true);
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await api.put(`/admin/users/${selectedUser.id}`, form);
      toast.success("User updated successfully");
      setShowEdit(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Update failed");
    } finally { setSubmitting(false); }
  };

  const handleResetPassword = async () => {
    if (!newPassword) { toast.error("Please enter a new password"); return; }
    setSubmitting(true);
    try {
      await api.put(`/admin/users/${selectedUser.id}`, { password: newPassword });
      toast.success("Password reset successfully");
      setShowPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Reset failed");
    } finally { setSubmitting(false); }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Permanently delete user "${user.name}"?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">User & Password Management</h2>
          <p className="text-sm text-slate-400 mt-1">Manage accounts, reset passwords, and control access</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search by name, email or role..." 
            className="pl-9 bg-slate-900 border-slate-800 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-semibold">User</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Role</TableHead>
                  <TableHead className="text-slate-400 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-400 font-semibold text-right">Security Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                          u.role === 'BRANCH_HEAD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'}
                      `}>
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${u.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}
                      `}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditClick(u)} title="Edit Profile">
                          <Edit2 className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handlePasswordClick(u)} title="Reset Password">
                          <Key className="h-4 w-4 text-amber-400" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-500 hover:bg-red-500/10" onClick={() => deleteUser(u)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-20">
              <UserCog className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No users found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription className="text-slate-400">Modify user details and control portal access.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="bg-slate-950 border-slate-800" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} type="email" className="bg-slate-950 border-slate-800" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <select 
                  value={form.role} 
                  onChange={(e) => setForm({...form, role: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-white"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="BRANCH_HEAD">Branch Head</option>
                  <option value="STAFF">Staff</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2 pt-2">
                  <button 
                    onClick={() => setForm({...form, is_active: !form.is_active})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.is_active ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="text-sm">{form.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)} className="border-slate-800 text-slate-300">Cancel</Button>
            <Button onClick={handleUpdate} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={showPassword} onOpenChange={setShowPassword}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-400" />
              Reset User Password
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Set a new password for <strong>{selectedUser?.name}</strong>. This action is immediate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                type="password" 
                placeholder="Enter strong new password"
                className="bg-slate-950 border-slate-800" 
              />
              <p className="text-[10px] text-slate-500 italic">User will need to log in with this new password immediately.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPassword(false)} className="border-slate-800 text-slate-300">Cancel</Button>
            <Button onClick={handleResetPassword} disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
