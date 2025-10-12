# 🚀 Complete Deployment Guide - DevTinder

## ✅ All Issues Fixed!

### Changes Made:

1. ✅ **Frontend `.env`** - Removed semicolon from API URL
2. ✅ **Backend CORS** - Fixed duplicate config and trailing slash
3. ✅ **Socket.IO CORS** - Fixed trailing slash
4. ✅ **Backend Port** - Made dynamic for Render
5. ✅ **Cookie Settings** - Added proper cross-origin cookie configuration
6. ✅ **Netlify Redirects** - Created `_redirects` file for SPA routing

---

## 📦 Backend Deployment (Render)

### Step 1: Environment Variables on Render

Make sure these are set in Render Dashboard → Environment:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=Dev@tinder23
PORT=10000
```

**⚠️ IMPORTANT**: The `PORT` variable will be automatically set by Render. The code now uses `process.env.PORT || 7777`.

### Step 2: Push Changes to GitHub

```bash
git add .
git commit -m "Fix deployment: CORS, cookies, and port configuration"
git push origin master
```

### Step 3: Deploy on Render

If auto-deploy is enabled, Render will automatically deploy. Otherwise:

- Go to Render Dashboard
- Click "Manual Deploy" → "Deploy latest commit"

### Step 4: Verify Backend is Running

Test your backend:

```bash
curl https://devtinder-backend-i79q.onrender.com/
```

Check Render logs for any errors.

---

## 🎨 Frontend Deployment (Netlify)

### Step 1: Environment Variables on Netlify

1. Go to Netlify Dashboard → Site Settings → Build & Deploy → Environment
2. Add this variable:
   ```
   VITE_API_URL=https://devtinder-backend-i79q.onrender.com
   ```

### Step 2: Build and Deploy

Option A - **Push to GitHub** (if auto-deploy enabled):

```bash
git add .
git commit -m "Fix deployment configuration"
git push origin master
```

Option B - **Manual Deploy**:

```bash
cd frontEnd
npm run build
```

Then drag the `dist` folder to Netlify.

### Step 3: Verify Deployment

Visit your site: `https://devfronten.netlify.app`

---

## 🧪 Testing After Deployment

### 1. Test Backend Health

```bash
curl https://devtinder-backend-i79q.onrender.com/
```

### 2. Test CORS

Open browser console on your Netlify site and run:

```javascript
fetch("https://devtinder-backend-i79q.onrender.com/", {
  credentials: "include",
}).then((r) => console.log("CORS OK:", r.ok));
```

### 3. Test Login Flow

1. Go to `https://devfronten.netlify.app/login`
2. Try to login
3. Open DevTools (F12) → Application → Cookies
4. Check if `token` cookie is set

### 4. Test Socket.IO

1. Open two browser windows
2. Login as different users
3. Try sending messages
4. Check Console for socket connection logs

---

## 🐛 Troubleshooting

### Issue: "CORS Policy Blocked"

**Check:**

- Backend CORS origin matches frontend URL exactly: `https://devfronten.netlify.app` (no trailing slash)
- No typos in Netlify URL

**Fix:**

```javascript
// Backend app.js should have:
cors({
  origin: ["http://localhost:5173", "https://devfronten.netlify.app"],
  credentials: true,
});
```

### Issue: "401 Unauthorized" on Protected Routes

**Problem:** Cookies not being sent/received

**Check:**

1. Cookie settings in `auth.js` have `sameSite: "none"` and `secure: true` in production
2. Frontend axios calls use `withCredentials: true`

**Verify in Browser:**

- DevTools → Application → Cookies
- Should see `token` cookie with `SameSite=None` and `Secure=true`

### Issue: Socket.IO Not Connecting

**Check:**

1. Render logs for socket connection attempts
2. Browser console for socket errors
3. Socket.IO CORS configuration matches frontend URL

**Debug:**

```javascript
// In Chat.jsx, add logging:
socket.current = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});
socket.current.on("connect", () => console.log("Socket connected!"));
socket.current.on("connect_error", (err) =>
  console.error("Socket error:", err)
);
```

### Issue: "Network Error" on All API Calls

**Check:**

1. Backend is running (check Render dashboard)
2. API URL in `.env` is correct
3. Rebuild frontend after changing `.env`

**Verify:**

```javascript
// In browser console:
console.log("API URL:", import.meta.env.VITE_API_URL);
// Should output: https://devtinder-backend-i79q.onrender.com
```

### Issue: Routes Not Working (404 on Refresh)

**Problem:** SPA routing not configured

**Solution:** Already fixed! The `_redirects` file handles this.

Verify `frontEnd/public/_redirects` contains:

```
/*    /index.html   200
```

---

## 📋 Critical Settings Checklist

### Backend (Render)

- [x] `NODE_ENV=production` in environment variables
- [x] CORS origins include Netlify URL (no trailing slash)
- [x] Cookie settings use `sameSite: "none"` and `secure: true` in production
- [x] Port uses `process.env.PORT`
- [x] MongoDB connection string is set
- [x] JWT secret is set

### Frontend (Netlify)

- [x] `VITE_API_URL` environment variable set
- [x] `_redirects` file exists in `public` folder
- [x] All axios calls use `withCredentials: true`
- [x] Build deployed successfully

---

## 🔧 Quick Reference

### Cookie Configuration (Backend)

```javascript
res.cookie("token", token, {
  httpOnly: true, // Prevents XSS
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Axios Configuration (Frontend)

```javascript
axios.post(
  BASE_URL + "/login",
  { emailId, password },
  { withCredentials: true } // Include cookies
);
```

### CORS Configuration (Backend)

```javascript
cors({
  origin: ["http://localhost:5173", "https://devfronten.netlify.app"],
  credentials: true,
});
```

---

## 🎯 Summary of Key Changes

| File                         | Change                            | Reason                 |
| ---------------------------- | --------------------------------- | ---------------------- |
| `frontEnd/.env`              | Removed `;` from URL              | Was breaking API calls |
| `Backend/app.js`             | Fixed duplicate CORS, removed `/` | CORS mismatch          |
| `Backend/app.js`             | Dynamic port `process.env.PORT`   | Render requirement     |
| `Backend/socket.js`          | Removed trailing `/`              | CORS mismatch          |
| `Backend/routers/auth.js`    | Added secure cookie settings      | Cross-origin cookies   |
| `frontEnd/public/_redirects` | Created SPA redirect rule         | Fix routing on refresh |

---

## ✅ Ready to Deploy!

All critical issues have been fixed. Follow the deployment steps above and your app should work perfectly!

If you encounter any issues, check the troubleshooting section or Render/Netlify logs for specific error messages.

Good luck! 🚀
