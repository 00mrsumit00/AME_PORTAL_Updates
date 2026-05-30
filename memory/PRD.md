# AME Portal - PRD & Implementation Record

## Original Problem Statement
Massively enhance the existing AME Portal (Student Admissions & Counselling Management SaaS Portal) for the Indian education system across Admin, Branch Head, Branch Staff, and Student roles.

### Requested enhancement areas
- **Admin (A1-A13):** advanced analytics, filters, new distributions, chart drill-down, Excel/PDF export, audit logs.
- **Branch Head (B1-B14):** branch-scoped analytics, staff management, branch audit logs, data export.
- **Branch Head / Staff (S1-S7):** complex student registration workflow, Add More Details flow, registered students actions, field-level verification, print receipt/profile.
- **Student (C1-C7, SL1):** richer dashboard, detailed profile, application tracker.
- **Cross-functional:** in-app chat between students and branch staff.

## Architecture
- **Frontend:** React 19 + Tailwind CSS + Shadcn UI + Recharts
- **Backend:** FastAPI + Motor (async MongoDB driver)
- **Database:** MongoDB (`users`, `branches`, `student_profiles`, `documents`, `payments`, `verification_logs`, `audit_logs`, `chat_messages`, `notifications`, `counters`)
- **Auth:** JWT + role-based middleware
- **File storage:** local `/uploads/` served through backend

## User Personas
1. **Admin** — branch operations, platform-wide analytics, audit visibility.
2. **Branch Head** — branch KPIs, staff management, student oversight.
3. **Branch Staff** — registration, updates, verification, chat support.
4. **Student** — profile completion, document upload, status tracking, support chat.

## Core Requirements Snapshot
- JWT authentication with role-based access (`ADMIN`, `BRANCH_HEAD`, `STAFF`, `STUDENT`)
- Conditional multi-step registration for Medical / Engineering / DSE
- Auto-generated registration numbers by stream
- Student additional details capture (personal, address, academics, parent details)
- Field-level verification with comments
- Export and print workflows
- Student-facing status tracking and support chat
- Audit logging for important actions

## Current Implementation Status (Updated: March 13, 2026)

### Backend
- Auth, branch CRUD, dashboards, analytics, audit logs, registration workflow, student detail updates, verification, export, chat, payments, notifications, and document upload APIs are implemented in `backend/server.py`.
- MongoDB response handling excludes `_id` from returned documents on active routes.
- Admin seed user remains available.

### Frontend

#### Admin
- Dashboard and branch management available.
- Analytics suite supports:
  - date / branch / course filters
  - chart drill-down with pagination
  - Excel export
  - PDF export via browser print/save-to-PDF flow

#### Branch Head / Staff
- Register Student flow supports multi-step counselling registration.
- Registered Students page supports:
  - search + filters
  - read-only view dialog
  - Add/Edit Details overlay using shared extended-details form
  - print profile
  - print receipt
  - chat entry point
- Branch Analytics supports Excel + PDF export.
- Verification View now supports expanded field-level verification sections:
  - personal
  - additional & address
  - academic
  - parent
- Verification history is surfaced in UI.
- Staff management and branch audit pages exist.

#### Student
- Student Dashboard now includes:
  - hero summary
  - application status tracker
  - quick actions
  - profile completion summary
  - document health
  - payment activity
  - notifications snapshot
- Student Profile now supports:
  - printable profile
  - Add More Details / Edit Details flow
  - shared extended-details form with save/cancel
  - richer tabbed detail presentation
- Student Documents and Student Chat remain available.

### Shared frontend additions
- `frontend/src/components/student/AdditionalDetailsForm.js`
- `frontend/src/lib/studentDetails.js`
- `frontend/src/lib/print.js`

## Testing Status

### Self-testing completed
- Login smoke test on preview URL passed.
- Backend curl validation passed for:
  - admin login
  - branch head login
  - branch staff creation
  - student registration
  - student additional-details update
  - student dashboard/profile fetch

### Testing agent status
- **`/app/test_reports/iteration_2.json`**: passed
- Result: **100% backend tests passed, frontend flows passed**
- Verified roles: Admin, Branch Head, Staff, Student
- Verified areas: analytics, exports, registered students actions, student dashboard/profile, verification UI, auth/regression

## Important Supporting Files
- `/app/design_guidelines.json`
- `/app/test_reports/iteration_2.json`
- `/app/backend/tests/test_ame_portal.py`

## Prioritized Backlog

### P0
- [x] Complete pending frontend parity for student profile, dashboard, verification view, and export/print flows
- [x] End-to-end testing of implemented enhancements

### P1
- [ ] Refactor `backend/server.py` monolith into routers/services/models for maintainability
- [ ] Add richer seeded QA data for full upload → verification queue → correction → re-upload regression cycles
- [ ] Improve print/export outputs with branded templates and optional downloadable PDF generation beyond browser print

### P2
- [ ] Bulk student import (CSV/Excel)
- [ ] SMS/Email notification integrations
- [ ] Forgot password / reset flow
- [ ] OTP-first student login
- [ ] AI-assisted document validation
- [ ] Cloud file storage migration
- [ ] Refresh tokens / rate limiting hardening

## Default / Active Test Credentials
- Admin: `admin@ame.com / admin123`
- Branch Head (QA): `branchhead1773412122@ame.com / Branch123!`
- Staff (QA): `staff1773412122@ame.com / Staff123!`
- Student (QA): `9890011223@ameportal.in / 9890011223`

## Notes
- PDF export is currently implemented as a **browser print / save-to-PDF flow**, not a server-generated PDF file.
- Verification queue requires students to upload documents before appearing in the queue; direct verification UI is otherwise available by route.
- No APIs are mocked.
