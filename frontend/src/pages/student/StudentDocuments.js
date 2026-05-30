import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, Clock, AlertTriangle, FileText, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG = {
  VERIFIED: { icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Verified" },
  PENDING: { icon: Clock, className: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Pending Review" },
  CORRECTION_REQUIRED: { icon: AlertTriangle, className: "bg-red-500/10 text-red-400 border-red-500/20", label: "Correction Required" },
};

export default function StudentDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const fileRefs = useRef({});

  useEffect(() => {
    api.get("/student/documents").then((r) => setDocuments(r.data)).catch(() => toast.error("Failed to load documents")).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (docId, file) => {
    if (!file) return;
    setUploading(docId);
    try {
      const formData = new FormData();
      formData.append("document_id", docId);
      formData.append("file", file);
      const res = await api.post("/student/documents/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setDocuments((prev) => prev.map((d) => (d.id === docId ? res.data : d)));
      toast.success("Document uploaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6" data-testid="student-documents">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Documents</h2>
        <p className="text-sm text-muted-foreground mt-1">Upload and manage your required documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const config = STATUS_CONFIG[doc.status] || STATUS_CONFIG.PENDING;
          const StatusIcon = config.icon;
          const hasFile = !!doc.file_url;
          return (
            <Card key={doc.id} className="border-border bg-card hover:border-primary/30 transition-colors" data-testid={`doc-card-${doc.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{doc.document_type}</p>
                      <Badge variant="outline" className={`mt-1 text-xs ${config.className}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {doc.remarks && doc.status === "CORRECTION_REQUIRED" && (
                  <div className="mb-3 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20" data-testid={`doc-remarks-${doc.id}`}>
                    <p className="text-xs text-destructive">{doc.remarks}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="file" ref={(el) => (fileRefs.current[doc.id] = el)}
                    className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleUpload(doc.id, e.target.files[0])}
                  />
                  <Button
                    size="sm" variant={hasFile ? "outline" : "default"}
                    onClick={() => fileRefs.current[doc.id]?.click()}
                    disabled={uploading === doc.id || doc.status === "VERIFIED"}
                    className="flex-1"
                    data-testid={`upload-btn-${doc.id}`}
                  >
                    {uploading === doc.id ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                    {hasFile ? "Re-upload" : "Upload"}
                  </Button>
                  {hasFile && (
                    <Button size="sm" variant="ghost" asChild data-testid={`view-btn-${doc.id}`}>
                      <a href={`${process.env.REACT_APP_BACKEND_URL}${doc.file_url}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-16" data-testid="no-documents">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No documents assigned yet</p>
        </div>
      )}
    </div>
  );
}
