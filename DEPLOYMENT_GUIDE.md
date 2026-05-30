# Deployment Guide: Admissions Made Easy (AME) Portal

This guide provides the necessary steps to deploy the AME Portal to a production environment.

## 🚀 Recommended Stack
- **Frontend**: Netlify or Vercel (Fast, handles SPA routing automatically with `_redirects`).
- **Backend**: Render or Heroku (FastAPI/Python 3.11+).
- **Database**: MongoDB Atlas (Cloud Database).

---

## 🔧 1. Backend Configuration (Render/Heroku)

**Build Command**: `pip install -r autorequirements.txt` (or similar)
**Start Command**: `python server.py` (or `uvicorn server:app --host 0.0.0.0 --port 8000`)

### Required Environment Variables:
| Variable | Description |
| :--- | :--- |
| `MONGO_URL` | MongoDB Atlas Connection String (srv) |
| `DB_NAME` | Name of the production database |
| `JWT_SECRET` | A secure, random string for auth tokens |
| `CORS_ORIGINS` | Commma-separated list of your frontend URLs |
| `PORT` | Set automatically by most providers (default: 8000) |

---

## 🌐 2. Frontend Configuration (Netlify/Vercel)

**Build Command**: `npm run build`
**Publish Directory**: `build/`

### Required Environment Variables:
| Variable | Description |
| :--- | :--- |
| `REACT_APP_BACKEND_URL` | Full URL of your deployed backend (no trailing slash) |

---

## ✅ 3. Pre-Deployment Checklist

1.  **MongoDB Atlas IP Whitelisting**: Ensure your production IP (or `0.0.0.0/0`) is whitelisted in Atlas.
2.  **SSL Handling**: The backend automatically uses `certifi.where()` for secure handshakes with Atlas.
3.  **SPA Routing**: The `frontend/public/_redirects` file is already included for seamless page refreshes.
4.  **Static Assets**: All landing page images are stored in `frontend/public/landing-assets` and will be included in the bundle.
5.  **CORS Settings**: Ensure `CORS_ORIGINS` in your backend precisely match your frontend domain.

---

## 🧪 4. Local Build Test
To verify the production build locally:
```bash
cd frontend
npm run build
```
This should generate a `build/` folder with minified assets.
