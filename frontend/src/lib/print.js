const escapeHtml = (value = "") => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const baseStyles = `
  body { font-family: Manrope, Arial, sans-serif; padding: 32px; color: #0f172a; }
  h1, h2, h3 { margin: 0 0 12px; color: #0f172a; }
  .muted { color: #475569; }
  .section { margin-top: 24px; page-break-inside: avoid; }
  .panel { border: 1px solid #cbd5e1; border-radius: 16px; padding: 18px; margin-bottom: 16px; }
  .grid { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
  .row:last-child { border-bottom: none; }
  .label { font-size: 12px; color: #64748b; }
  .value { font-size: 13px; font-weight: 700; text-align: right; }
  .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 700; margin-right: 8px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 12px; }
  th { background: #f8fafc; color: #334155; }
`;

const openPrintWindow = ({ title, body }) => {
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1200,height=900");
  if (!printWindow) return false;

  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>${baseStyles}</style>
      </head>
      <body>${body}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
  return true;
};

const renderRows = (rows = []) => rows
  .filter(([, value]) => value !== undefined && value !== null && value !== "")
  .map(([label, value]) => `
    <div class="row">
      <span class="label">${escapeHtml(label)}</span>
      <span class="value">${escapeHtml(value)}</span>
    </div>
  `)
  .join("");

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const printStudentProfile = ({ student }) => {
  if (!student) return false;

  const additional = student.additional_details || {};
  const address = student.address_details || {};
  const tenth = student.education_10th || {};
  const eleventh = student.education_11th || {};
  const twelfth = student.education_12th || {};
  const parent = student.parent_details || {};

  return openPrintWindow({
    title: `Student Profile - ${student.registration_no || student.full_name}`,
    body: `
      <div class="panel">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;">
          <div>
            <h1>Student Profile</h1>
            <p class="muted">${escapeHtml(student.registration_no || "")}</p>
          </div>
          <div>
            <span class="badge">${escapeHtml(student.counselling_type || "")}</span>
            <span class="badge">${escapeHtml(student.verification_status || "PENDING")}</span>
          </div>
        </div>
        ${renderRows([
          ["Full Name", student.full_name],
          ["Student Phone", student.phone],
          ["Parent Phone", student.parent_phone],
          ["Date of Birth", student.dob],
          ["Gender", student.gender],
          ["District", student.district],
          ["Category", student.category],
          ["Caste", student.caste],
          ["Selection", student.selection_display],
          ["Registered By", student.registered_by],
        ])}
      </div>
      <div class="grid">
        <div class="panel section">
          <h3>Additional Details</h3>
          ${renderRows([
            ["Mother's Name", additional.mother_name],
            ["Email", additional.email],
            ["Religion", additional.religion],
            ["Family Income", additional.family_income],
            ["Aadhaar", additional.aadhaar_number],
          ])}
        </div>
        <div class="panel section">
          <h3>Address</h3>
          ${renderRows([
            ["Address", additional.address],
            ["Taluka", address.taluka],
            ["District", address.district],
            ["PIN Code", address.pin_code],
          ])}
        </div>
      </div>
      <div class="grid">
        <div class="panel section">
          <h3>10th Qualification</h3>
          ${renderRows([
            ["Board", tenth.board],
            ["Year", tenth.year],
            ["Percentage", tenth.percentage],
            ["School", tenth.school],
            ["District", tenth.district],
          ])}
        </div>
        <div class="panel section">
          <h3>11th / 12th Qualification</h3>
          ${renderRows([
            ["11th Board", eleventh.board],
            ["11th Percentage", eleventh.percentage],
            ["11th College", eleventh.college],
            ["12th Board", twelfth.board],
            ["12th Percentage", twelfth.percentage],
            ["12th College", twelfth.college],
          ])}
        </div>
      </div>
      <div class="panel section">
        <h3>Parent Details</h3>
        ${renderRows([
          ["Father Occupation", parent.father_occupation],
          ["Father Qualification", parent.father_qualification],
          ["Mother Occupation", parent.mother_occupation],
          ["Mother Qualification", parent.mother_qualification],
        ])}
      </div>
    `,
  });
};

export const printStudentReceipt = ({ student, payment, branch }) => {
  if (!student) return false;
  const paymentData = payment || {};
  const branchData = branch || {};

  return openPrintWindow({
    title: `Registration Receipt - ${student.registration_no || student.full_name}`,
    body: `
      <div class="panel">
        <h1>Counselling Registration Receipt</h1>
        <p class="muted">${escapeHtml(branchData.name || "AME Portal")}${branchData.location ? ` · ${escapeHtml(branchData.location)}` : ""}</p>
        ${renderRows([
          ["Registration Number", student.registration_no],
          ["Student Name", student.full_name],
          ["Student WhatsApp", student.phone],
          ["Parent WhatsApp", student.parent_phone],
          ["Counselling Type", student.selection_display || student.counselling_type],
          ["Category", student.category],
          ["Payment Amount", paymentData.amount ? `Rs. ${paymentData.amount}` : "Rs. 0"],
          ["Payment Mode", paymentData.payment_mode],
          ["UTR Number", paymentData.utr_number],
          ["Registered By", student.registered_by],
          ["Date & Time", student.created_at ? new Date(student.created_at).toLocaleString() : ""],
          ["Branch Contact", branchData.contact_number],
        ])}
      </div>
      <p class="muted" style="margin-top:18px;">This is a system-generated receipt.</p>
    `,
  });
};

export const printAnalyticsReport = ({ title, filters = [], summary = [], sections = [] }) => {
  const filtersHtml = filters.length ? `
    <div class="panel section">
      <h3>Applied Filters</h3>
      ${renderRows(filters)}
    </div>
  ` : "";

  const summaryHtml = summary.length ? `
    <div class="panel section">
      <h3>Summary</h3>
      ${renderRows(summary)}
    </div>
  ` : "";

  const sectionHtml = sections.map((section) => `
    <div class="panel section">
      <h3>${escapeHtml(section.title)}</h3>
      <table>
        <thead>
          <tr>
            <th>${escapeHtml(section.columns?.[0] || "Metric")}</th>
            <th>${escapeHtml(section.columns?.[1] || "Value")}</th>
          </tr>
        </thead>
        <tbody>
          ${(section.rows || []).map((row) => `
            <tr>
              <td>${escapeHtml(row[0])}</td>
              <td>${escapeHtml(row[1])}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `).join("");

  return openPrintWindow({
    title,
    body: `
      <div class="panel">
        <h1>${escapeHtml(title)}</h1>
        <p class="muted">Generated on ${escapeHtml(new Date().toLocaleString())}</p>
      </div>
      ${filtersHtml}
      ${summaryHtml}
      ${sectionHtml}
    `,
  });
};