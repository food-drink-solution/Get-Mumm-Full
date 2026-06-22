# Get-Mumm Quick Reference

## URLs

| App | URL | Status |
|-----|-----|--------|
| Frontend | https://get-mumm.netlify.app | ✅ Ready |
| Dashboard | https://dashbord-get-mumm.netlify.app | ✅ Ready |
| Backend API | http://get-mumm.runasp.net | ✅ Live |
| Local Frontend | http://localhost:5173 | Dev only |
| Local Dashboard | http://localhost:4200 | Dev only |

---

## API Base URL
```
http://get-mumm.runasp.net/api/
```

---

## Environment Variables

### Frontend
| Variable | Value |
|----------|-------|
| VITE_API_URL | http://get-mumm.runasp.net |
| VITE_SUPABASE_URL | https://lhnlhnrtxzpeylvjcisk.supabase.co |
| VITE_SUPABASE_ANON_KEY | (configured in .env.local) |

### Dashboard
| Variable | Value |
|----------|-------|
| NG_APP_API_URL | http://get-mumm.runasp.net |
| NG_APP_SUPABASE_URL | https://lhnlhnrtxzpeylvjcisk.supabase.co |
| NG_APP_SUPABASE_ANON_KEY | (configured in .env.local) |
| NODE_ENV | development or production |

---

## Start Local Development

### Dashboard Only
```bash
cd dashboard
npm start
# http://localhost:4200
```

### Frontend Only
```bash
cd frontend
npm run dev
# http://localhost:5173
```

### Build Dashboard
```bash
cd dashboard
npm install --force
npm run build
# Output: dist/dashboard/
```

---

## Key Files Updated

| File | Change |
|------|--------|
| frontend/.env.local | API URL → backend |
| dashboard/.env.local | API URL → backend |
| dashboard/.env.production | API URL → backend |
| backend/appsettings.json | CORS updated |
| backend/appsettings.Development.json | CORS updated |
| backend/appsettings.Production.json | CORS updated + security |

---

## Deployment Status

✅ Backend: Deployed to Azure  
✅ Frontend: Ready (auto-deploy on push)  
✅ Dashboard: Ready (auto-deploy on push)  
✅ Database: Connected (Supabase)  
✅ CORS: Configured for all apps  

---

## Test Backend Health

```bash
curl http://get-mumm.runasp.net/api/Health
```

Expected response:
```json
{
  "status": "Healthy",
  "timestamp": "2026-06-22T23:43:20.0775298Z",
  "message": "Service is operational",
  "databaseConnected": true
}
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Dashboard won't connect | Check NG_APP_API_URL in .env.local |
| Frontend API fails | Check VITE_API_URL in .env.local |
| CORS error | Backend CORS already includes both apps |
| Build fails | Run `npm install --force` then `npm run build` |

---

## Documentation

- 📋 DEPLOYMENT_SUMMARY.md - Complete configuration overview
- 🧪 LOCAL_TESTING_GUIDE.md - How to test locally
- 📝 QUICK_REFERENCE.md - This file

---

**Last Updated**: June 23, 2026  
**Backend**: http://get-mumm.runasp.net ✅
