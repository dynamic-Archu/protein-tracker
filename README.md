# Protein Tracker 🚀

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

A premium, modern, glassmorphism-inspired web application designed to help users accurately track their daily protein intake, seamlessly scale macro-goals based on biological profiles, and visualize long-term health trends. 

Designed with a "Mobile-First to Desktop-Expansive" responsive CSS Grid, ensuring a flawless user experience on any device.

## ✨ Key Features

- **Personalized Goal Engine:** Automatically calculates your daily protein requirement based on age, height, weight, and gender using the Mifflin-St Jeor equation.
- **Real-time Synchronization:** Built on Firebase Firestore for instant, cross-device data syncing without manual refreshes.
- **Authentication & Security:** Secure Google OAuth and Passwordless Email sign-in flows.
- **Interactive Data Visualization:** Dynamic Area Charts via Recharts for tracking 7-day or 30-day consistency.
- **Power History Tools:** Multi-select actions, bulk deletion, fuzzy searching, and retroactive logging via an intuitive calendar interface.
- **Premium Aesthetics:** Dark/Light mode, transparent glass-panels, custom floating SVG background decorations, and fluid Framer Motion page transitions.
- **Global Timezone Support:** Automatically formats dates and resets daily progress based entirely on the user's localized browser timezone.

## 🛠 Tech Stack

- **Frontend Framework:** React 18, Vite
- **Global State & DB:** Firebase (Firestore, Auth)
- **Routing & Transitions:** React State Modeling + Framer Motion
- **Styling:** Vanilla CSS (CSS Grid, Flexbox, Variable Tokens, Glassmorphism)
- **Icons & Graphics:** Lucide React, Custom SVG Nodes
- **Data Visualization:** Recharts
- **Date Utilities:** date-fns

---

## 🚀 Getting Started

To run this application locally on your machine:

### Prerequisites
- Node.js (v16.14.0 or higher)
- npm or yarn
- A Firebase Project (for the Backend Database and Authentication)

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd protein-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase Configuration
Create a `.env` file in the root directory and add your Firebase project keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🌍 Deploying to the Public Internet (Free & 24/7)

To make your web app accessible to anyone in the world like a real site, we recommend publishing on **Vercel** or **Netlify**. Both platforms offer generous free tiers that handle global traffic perfectly.

### Method A: Deploying with Vercel (Recommended)
1. **Push your code to GitHub:** Ensure your project is committed and pushed to a GitHub repository.
2. **Create a Vercel Account:** Go to [vercel.com](https://vercel.com/) and sign up using your GitHub account.
3. **Import Project:** Click "Add New..." -> "Project". Select your `protein-tracker` repository from the list.
4. **Configure Environment Variables:** In the deployment setup screen, expand "Environment Variables" and paste the exact keys from your local `.env` file.
5. **Deploy:** Click the "Deploy" button. Vercel will automatically build the Vite app and issue a free custom `your-app.vercel.app` HTTPS domain that is live 24/7.

---

## 🔀 Managing 2 GitHub Profiles

If you want to maintain this repository across two different GitHub accounts (e.g., your personal account and an organizational/portfolio account), Git allows you to push code to multiple "remotes" simultaneously.

### Step-by-Step Guide:
1. **Create the target Repositories:** Login to *Account A* and create a blank repository. Then, login to *Account B* and create a second blank repository.
2. **Add Remote URLs to your local project:**
   Open your terminal in the Root of the `protein-tracker` project.
   
   Add Account A (default `origin`):
   ```bash
   git remote add origin https://github.com/AccountA/protein-tracker.git
   ```
   
   Add Account B (call it `secondary` or whatever you prefer):
   ```bash
   git remote add secondary https://github.com/AccountB/protein-tracker.git
   ```

3. **Push to Both Remotes:** 
   Whenever you make a commit that you want reflected universally, simply run:
   ```bash
   git push origin main
   git push secondary main
   ```
   *(Note: Git authentication handles which profile is authorized. You might need to set up SSH keys or Personal Access Tokens for seamless credential management if terminal swapping becomes tedious).*

---
*Built with ❤️ for health, analytics, and exceptional design.*
