import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Wallet, Plus, Search, FileSpreadsheet, FileText, Edit2, Trash2,
  ChevronLeft, ChevronRight, Loader2, TrendingUp, CalendarDays,
  Receipt, Paperclip, X, IndianRupee, Filter, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

// ─── Constants ───────────────────────────────────────────────────────────────
const PAYMENT_MODES = ["Cash", "UPI", "Bank Transfer", "Card"];
const EXPENSE_CATEGORIES = [
  "Travel", "Marketing", "Food & Beverages", "Office Supplies",
  "Utilities", "Printing", "Courier", "Maintenance", "Software",
  "Training", "Miscellaneous"
];

const today = () => new Date().toISOString().split("T")[0];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  // Handle both "YYYY-MM-DD" and ISO strings
  const d = new Date(dateStr.length === 10 ? dateStr + "T00:00:00" : dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const MODE_BADGE = {
  "Cash": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "UPI": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Bank Transfer": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Card": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ title, value, icon: Icon, accent, loading }) {
  return (
    <Card className="bg-card border-border relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
      <div className={`absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity ${accent}`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            {loading ? (
              <div className="h-8 w-28 bg-secondary/50 animate-pulse rounded-md" />
            ) : (
              <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-xl border ${accent} bg-opacity-10`}>
            <Icon className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Expense Form Modal ───────────────────────────────────────────────────────
function ExpenseFormModal({ open, onClose, expense, branchUsers, onSaved }) {
  const isEdit = !!expense;
  const [form, setForm] = useState({
    expense_for: "", amount: "", note: "", payment_mode: "Cash",
    payment_done_by: "", payment_done_by_name: "", date: today(),
    attachment_url: ""
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setForm({
        expense_for: expense.expense_for || "",
        amount: expense.amount?.toString() || "",
        note: expense.note || "",
        payment_mode: expense.payment_mode || "Cash",
        payment_done_by: expense.payment_done_by || "",
        payment_done_by_name: expense.payment_done_by_name || "",
        date: expense.date || today(),
        attachment_url: expense.attachment_url || ""
      });
      setAttachmentName(expense.attachment_url ? expense.attachment_url.split("/").pop() : "");
    } else {
      setForm({ expense_for: "", amount: "", note: "", payment_mode: "Cash", payment_done_by: "", payment_done_by_name: "", date: today(), attachment_url: "" });
      setAttachmentName("");
    }
    setErrors({});
  }, [expense, open]);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.expense_for.trim()) e.expense_for = "Required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter a valid positive amount";
    if (!form.payment_done_by) e.payment_done_by = "Required";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUserChange = (userId) => {
    const user = branchUsers.find(u => u.id === userId);
    set("payment_done_by", userId);
    set("payment_done_by_name", user ? user.name : "");
  };

  const handleAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/branch/expenses/upload-attachment", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      set("attachment_url", res.data.file_url);
      setAttachmentName(file.name);
      toast.success("Attachment uploaded");
    } catch {
      toast.error("Failed to upload attachment");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount)
      };
      if (isEdit) {
        await api.put(`/branch/expenses/${expense.id}`, payload);
        toast.success("Expense updated successfully");
      } else {
        await api.post("/branch/expenses", payload);
        toast.success("Expense added successfully");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save expense");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto" data-testid="expense-form-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
            {isEdit ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the expense details below." : "Fill in the details to record a new branch expense."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Expense For */}
          <div className="space-y-1.5">
            <Label htmlFor="expense_for" className="text-sm font-medium">
              Expense For <span className="text-destructive">*</span>
            </Label>
            <Input
              id="expense_for"
              list="expense-categories"
              placeholder="e.g. Travel, Marketing, Office Supplies..."
              value={form.expense_for}
              onChange={e => set("expense_for", e.target.value)}
              className="bg-background border-border h-10"
              data-testid="expense-for-input"
            />
            <datalist id="expense-categories">
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c} />)}
            </datalist>
            {errors.expense_for && <p className="text-xs text-destructive">{errors.expense_for}</p>}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (₹) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={e => set("amount", e.target.value)}
                  className="bg-background border-border h-10 pl-8"
                  data-testid="expense-amount-input"
                />
              </div>
              {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-sm font-medium">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={e => set("date", e.target.value)}
                className="bg-background border-border h-10"
                data-testid="expense-date-input"
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>
          </div>

          {/* Payment Mode & Paid By */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Mode of Payment</Label>
              <Select value={form.payment_mode} onValueChange={v => set("payment_mode", v)}>
                <SelectTrigger className="bg-background border-border h-10" data-testid="payment-mode-select">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_MODES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Payment Done By <span className="text-destructive">*</span>
              </Label>
              <Select value={form.payment_done_by} onValueChange={handleUserChange}>
                <SelectTrigger className="bg-background border-border h-10" data-testid="paid-by-select">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {branchUsers.map(u => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} <span className="text-muted-foreground text-xs">({u.role === "BRANCH_HEAD" ? "Head" : "Staff"})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payment_done_by && <p className="text-xs text-destructive">{errors.payment_done_by}</p>}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="note" className="text-sm font-medium">
              Note <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="note"
              placeholder="Add any additional remarks..."
              value={form.note}
              onChange={e => set("note", e.target.value)}
              className="bg-background border-border resize-none min-h-[80px] text-sm"
              data-testid="expense-note-input"
            />
          </div>

          {/* Attachment */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Attachment <span className="text-muted-foreground text-xs">(optional — bills, receipts)</span>
            </Label>
            {form.attachment_url ? (
              <div className="flex items-center gap-2 p-2.5 bg-secondary/30 border border-border rounded-lg">
                <Paperclip className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
                <a href={`${process.env.REACT_APP_BACKEND_URL}${form.attachment_url}`} target="_blank" rel="noreferrer"
                  className="text-sm text-primary hover:underline truncate flex-1">
                  {attachmentName || "View Attachment"}
                </a>
                <button
                  type="button"
                  onClick={() => { set("attachment_url", ""); setAttachmentName(""); }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="attachment-upload"
                className="flex items-center gap-3 p-3 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Paperclip className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                )}
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {uploading ? "Uploading..." : "Click to upload bill or receipt"}
                </span>
                <input
                  id="attachment-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={handleAttachment}
                  data-testid="attachment-input"
                />
              </label>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="border-border" data-testid="cancel-expense-btn">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving || uploading} data-testid="save-expense-btn">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isEdit ? "Update Expense" : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExpenseManager() {
  const { user } = useAuth();
  const isBranchHead = user?.role === "BRANCH_HEAD";

  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summary, setSummary] = useState({ today: 0, month: 0 });
  const [branchUsers, setBranchUsers] = useState([]);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [paidByFilter, setPaidByFilter] = useState("");

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpense, setDeleteExpense] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const PAGE_SIZE = 15;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await api.get("/branch/expenses/summary");
      setSummary(res.data);
    } catch { /* silent */ }
    finally { setSummaryLoading(false); }
  }, []);

  const fetchBranchUsers = useCallback(async () => {
    try {
      const res = await api.get("/branch/staff-list");
      setBranchUsers(res.data);
    } catch { /* silent */ }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);
      if (modeFilter) params.append("payment_mode", modeFilter);
      if (paidByFilter) params.append("paid_by", paidByFilter);
      const res = await api.get(`/branch/expenses?${params}`);
      setExpenses(res.data.expenses);
      setTotal(res.data.total);
    } catch { toast.error("Failed to load expenses"); }
    finally { setLoading(false); }
  }, [page, dateFrom, dateTo, modeFilter, paidByFilter]);

  useEffect(() => { fetchSummary(); fetchBranchUsers(); }, [fetchSummary, fetchBranchUsers]);
  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const handleSaved = () => { fetchExpenses(); fetchSummary(); };

  const handleDelete = async () => {
    if (!deleteExpense) return;
    setDeleting(true);
    try {
      await api.delete(`/branch/expenses/${deleteExpense.id}`);
      toast.success("Expense deleted");
      setDeleteExpense(null);
      handleSaved();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleExcelExport = async () => {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);
      if (modeFilter) params.append("payment_mode", modeFilter);
      if (paidByFilter) params.append("paid_by", paidByFilter);
      const res = await api.get(`/branch/expenses/export?${params}`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expenses_export_${today()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Excel exported successfully");
    } catch { toast.error("Failed to export"); }
  };

  const handlePdfExport = () => {
    window.print();
  };

  const clearFilters = () => {
    setDateFrom(""); setDateTo(""); setModeFilter(""); setPaidByFilter(""); setPage(1);
  };

  const canEdit = (exp) => isBranchHead || exp.created_by_id === user?.id;
  const canDelete = (exp) => isBranchHead || exp.created_by_id === user?.id;

  const hasFilters = dateFrom || dateTo || modeFilter || paidByFilter;

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #expense-print-area, #expense-print-area * { visibility: visible !important; }
          #expense-print-area { position: absolute; inset: 0; padding: 24px; }
        }
      `}</style>

      <div className="space-y-6" data-testid="expense-manager">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Wallet className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Expense Manager</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Branch-level shared expense ledger</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border h-9 gap-1.5"
              onClick={handleExcelExport}
              data-testid="export-excel-btn"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
              <span className="hidden sm:inline">Excel</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border h-9 gap-1.5"
              onClick={handlePdfExport}
              data-testid="export-pdf-btn"
            >
              <FileText className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
              <span className="hidden sm:inline">PDF</span>
            </Button>
            <Button
              size="sm"
              className="h-9 gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              onClick={() => setAddOpen(true)}
              data-testid="add-expense-btn"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Add Expense
            </Button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SummaryCard
            title="Total Expenses — Today"
            value={formatCurrency(summary.today)}
            icon={CalendarDays}
            accent="bg-sky-500"
            loading={summaryLoading}
          />
          <SummaryCard
            title="Total Expenses — This Month"
            value={formatCurrency(summary.month)}
            icon={TrendingUp}
            accent="bg-primary"
            loading={summaryLoading}
          />
        </div>

        {/* ── Filters ── */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="font-medium">Filters</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                  className="h-9 w-38 bg-background border-border text-sm"
                  placeholder="From"
                  data-testid="filter-date-from"
                />
                <span className="text-muted-foreground text-xs">to</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={e => { setDateTo(e.target.value); setPage(1); }}
                  className="h-9 w-38 bg-background border-border text-sm"
                  placeholder="To"
                  data-testid="filter-date-to"
                />
              </div>

              <Select value={modeFilter || "ALL"} onValueChange={v => { setModeFilter(v === "ALL" ? "" : v); setPage(1); }}>
                <SelectTrigger className="w-40 h-9 bg-background border-border text-sm" data-testid="filter-mode">
                  <SelectValue placeholder="All Modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Modes</SelectItem>
                  {PAYMENT_MODES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={paidByFilter || "ALL"} onValueChange={v => { setPaidByFilter(v === "ALL" ? "" : v); setPage(1); }}>
                <SelectTrigger className="w-44 h-9 bg-background border-border text-sm" data-testid="filter-paid-by">
                  <SelectValue placeholder="All People" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All People</SelectItem>
                  {branchUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                  data-testid="clear-filters-btn"
                >
                  <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Clear
                </Button>
              )}

              <div className="ml-auto text-xs text-muted-foreground">
                {!loading && <span>{total} record{total !== 1 ? "s" : ""}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Table ── */}
        <Card className="border-border bg-card" id="expense-print-area">
          {/* print header (only visible when printing) */}
          <div className="hidden print:block p-4 border-b border-border">
            <h1 className="text-xl font-bold">Branch Expense Report</h1>
            <p className="text-sm text-muted-foreground">Generated on {formatDate(today())}</p>
          </div>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-7 h-7 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading expenses...</p>
              </div>
            ) : expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center">
                  <Receipt className="w-8 h-8 text-muted-foreground" strokeWidth={1} />
                </div>
                <div>
                  <p className="text-base font-medium text-foreground">No expenses found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {hasFilters ? "Try adjusting or clearing your filters." : "Click 'Add Expense' to record the first one."}
                  </p>
                </div>
                {!hasFilters && (
                  <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
                    <Plus className="w-4 h-4" /> Add Expense
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs font-semibold w-28">Date</TableHead>
                      <TableHead className="text-xs font-semibold">Expense For</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Amount</TableHead>
                      <TableHead className="text-xs font-semibold">Paid By</TableHead>
                      <TableHead className="text-xs font-semibold">Mode</TableHead>
                      <TableHead className="text-xs font-semibold">Created By</TableHead>
                      <TableHead className="text-xs font-semibold w-8"></TableHead>
                      <TableHead className="text-xs font-semibold text-right print:hidden">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((exp) => (
                      <TableRow key={exp.id} className="border-border" data-testid={`expense-row-${exp.id}`}>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(exp.date)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium text-foreground">{exp.expense_for}</p>
                            {exp.note && (
                              <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">{exp.note}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm font-semibold text-foreground font-mono">
                            {formatCurrency(exp.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-foreground whitespace-nowrap">
                          {exp.payment_done_by_name || "—"}
                        </TableCell>
                        <TableCell>
                          {exp.payment_mode ? (
                            <Badge
                              variant="outline"
                              className={`text-xs whitespace-nowrap ${MODE_BADGE[exp.payment_mode] || "bg-secondary/50 text-muted-foreground border-border"}`}
                            >
                              {exp.payment_mode}
                            </Badge>
                          ) : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {exp.created_by_name || "—"}
                        </TableCell>
                        <TableCell>
                          {exp.attachment_url && (
                            <a
                              href={`${process.env.REACT_APP_BACKEND_URL}${exp.attachment_url}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View attachment"
                              className="text-primary/60 hover:text-primary transition-colors"
                            >
                              <Paperclip className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </a>
                          )}
                        </TableCell>
                        <TableCell className="text-right print:hidden">
                          <div className="flex justify-end gap-1">
                            {canEdit(exp) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Edit expense"
                                onClick={() => setEditExpense(exp)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                data-testid={`edit-expense-${exp.id}`}
                              >
                                <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                              </Button>
                            )}
                            {canDelete(exp) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Delete expense"
                                onClick={() => setDeleteExpense(exp)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                data-testid={`delete-expense-${exp.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Page {page} of {totalPages} &nbsp;·&nbsp; {total} total
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="h-8 w-8 p-0 border-border"
                    data-testid="prev-page-btn"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="h-8 w-8 p-0 border-border"
                    data-testid="next-page-btn"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Add Expense Modal ── */}
      <ExpenseFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        expense={null}
        branchUsers={branchUsers}
        onSaved={handleSaved}
      />

      {/* ── Edit Expense Modal ── */}
      <ExpenseFormModal
        open={!!editExpense}
        onClose={() => setEditExpense(null)}
        expense={editExpense}
        branchUsers={branchUsers}
        onSaved={handleSaved}
      />

      {/* ── Delete Confirm Dialog ── */}
      <AlertDialog open={!!deleteExpense} onOpenChange={() => setDeleteExpense(null)}>
        <AlertDialogContent className="bg-card border-border" data-testid="delete-confirm-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the expense{" "}
              <span className="font-semibold text-foreground">
                "{deleteExpense?.expense_for}"
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(deleteExpense?.amount)}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border" data-testid="cancel-delete-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              data-testid="confirm-delete-btn"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
