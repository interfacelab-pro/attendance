# 🔥 Firebase Setup & Deployment Guide

Follow these steps once to get the app running.

---

## STEP 1 — Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it something like `attendance-app`
4. Disable Google Analytics (not needed) → Click **"Create project"**

---

## STEP 2 — Enable Authentication

1. In the Firebase console, go to **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in method**, enable **Email/Password**
4. Click **Save**

---

## STEP 3 — Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** → Click **Next**
4. Choose your region (e.g. `us-central` or closest to Pakistan: `asia-south1`) → Click **Enable**

---

## STEP 4 — Add Security Rules

1. In Firestore, go to the **Rules** tab
2. Replace the default rules with the contents of `firestore.rules` in this project
3. Click **"Publish"**

---

## STEP 5 — Firebase Config ✅ ALREADY DONE

Your Firebase credentials are already in `src/firebase/config.js`. No action needed here.

---

## STEP 6 — Create the Admin Account

The first user who registers through the app will have the role `intern` by default.
To make yourself admin, do this **once** after registering your account:

1. Go to Firebase console → **Firestore Database**
2. Click **users** collection → find your document (it'll be your UID)
3. Click the **role** field → change the value from `"intern"` to `"admin"`
4. Click **Update**

Now when you log in, you'll be redirected to the Admin Panel automatically.

---

## STEP 7 — Run the App Locally

```bash
cd attendance-app
npm install
npm start
```

The app will open at http://localhost:3000

---

## STEP 8 — Deploy to GitHub Pages

Your repo is already set up at https://github.com/interfacelab-pro/attendance

1. Push the code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/interfacelab-pro/attendance.git
git push -u origin main
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

3. In your GitHub repo → **Settings → Pages**
   - Set source to **gh-pages branch**
   - Your app will be live at: `https://interfacelab-pro.github.io/attendance`

> ✅ The `homepage` in `package.json` is already set to this URL.

---

## STEP 9 — Print the QR Code

1. Open the live app URL
2. Log in as admin
3. Click **"QR Code"** button in the top right
4. Click **"Print QR Code"**
5. Place the printed QR at the office entrance!

---

## STEP 10 — Share with Intern

Send the intern the URL of your app. They should:
1. Open the URL
2. Click **"Register here"**
3. Enter their name, email, and password
4. Start clocking in/out!

---

## 📁 Project Structure

```
attendance-app/
├── public/
│   └── index.html
├── src/
│   ├── firebase/
│   │   └── config.js          ← PUT YOUR FIREBASE KEYS HERE
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js       ← Intern view
│   │   ├── AdminPanel.js      ← Admin view
│   │   └── QRPage.js          ← Printable QR code
│   ├── utils/
│   │   └── attendanceUtils.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── firestore.rules
└── package.json
```

---

## ❓ Troubleshooting

**"Permission denied" errors in Firestore**
→ Make sure you deployed the `firestore.rules` file (Step 4)

**Admin panel not showing**
→ Make sure you changed your role to `"admin"` in Firestore (Step 6)

**QR code shows wrong URL on print**
→ Make sure you deployed to GitHub Pages first, then visit the live URL to print

**Blank page on GitHub Pages**
→ Make sure `homepage` in `package.json` matches your GitHub Pages URL exactly
