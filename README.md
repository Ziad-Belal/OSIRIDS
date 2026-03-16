# OSIRIDS | Pharoic Clothing

Modern, minimal e-commerce platform for a clothing brand with an ancient Egyptian theme.

## 🏺 Project Overview
- **Brand**: Osirids
- **Theme**: Pharoic (Modern/Minimalist)
- **Front-end**: React (Vite + TypeScript + Tailwind CSS)
- **Back-end**: Supabase (PostgreSQL Database + Auth)
- **Hosting**: Firebase Hosting

## 🛠️ Tech Stack
- **Styling**: Tailwind CSS
- **Icons**: Lucide-React
- **Database**: Supabase
- **Routing**: React Router DOM

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Supabase Account](https://supabase.com/)
- [Firebase Account](https://firebase.google.com/)

### 2. Database Setup
1. Create a new project in Supabase.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase_setup.sql` and run the script.

### 3. Environment Configuration
1. Create a `.env` file in the root directory.
2. Copy the keys from `.env.example`.
3. Fill in your Supabase and Firebase project details.

### 4. Installation
```bash
npm install
```

### 5. Running the App
```bash
npm run dev
```

### 6. Deployment (Firebase)
1. Build the project:
   ```bash
   npm run build
   ```
2. Initialize Firebase (if not already):
   ```bash
   firebase login
   firebase init
   ```
3. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## 📐 Design Philosophy
The design focuses on a **dark, luxurious** palette:
- **Primary Color**: Pharoic Gold (`#D4AF37`)
- **Secondary Color**: Pharoic Blue (`#002366`)
- **Background**: Matte Black (`#0A0A0A`)
- **Typography**: Playfair Display (Serif) for headings, Inter (Sans-serif) for body text.

---
Crafted for **Osirids**.
