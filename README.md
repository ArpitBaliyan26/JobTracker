# Smart Job Tracker Dashboard

A modern, SaaS-style React application designed to help students and professionals track their job search journey. Built for a college React course submission, this dashboard replaces messy spreadsheets with a structured, visual, and highly interactive tracking system.

## 🎯 Problem Statement
Tracking job applications using Excel or Notion often becomes chaotic:
- It's hard to visualize the pipeline (what's stuck in "Interview" vs "Applied").
- Lack of analytics to see which platforms yield the best results.
- Easy to miss deadlines or forget to follow up after an interview.
- No systematic way to sort by priority, salary, or application dates.

## ✨ Solution
The **Smart Job Tracker Dashboard** provides a structured workflow with a clean, responsive UI. It enforces logical date tracking (you can't schedule an interview before you've applied) while remaining flexible enough for future planning. 

## 🚀 Key Features

- **Application Pipeline:** Track jobs across 6 logical stages (To Apply → Applied → Interview → Waiting → Offer / Rejected).
- **Smart Validation:** Date logic that understands real-world flows. Hard errors block impossible dates (e.g., offer before interview), while soft yellow warnings allow future planning.
- **Advanced Sorting & Filtering:** Sort by pipeline-aware metrics like Deadline, Salary, Priority, and Application Date. Filter by status via quick-access tabs.
- **Analytics Dashboard:** Visual representation of your job hunt using Recharts (includes Pie charts for status/priority, and customized Platform bar charts with hover % insights).
- **Suggested Jobs Integration:** Fetches real mock data via Axios from a dummy API, with 1-click pre-fill application functionality.
- **Dynamic Bookmarking:** Pin high-priority roles directly to your dashboard.
- **Dynamic Seed Data:** A "Reset Data" feature that generates realistic, mathematically randomized mock data for testing.
- **Theming:** Full Light, Dark, and System theme support using CSS variables.

## 🛠️ Technical Implementation

- **Library:** React (Functional Components)
- **State Management:** Custom Context API (`ApplicationContext`, `ThemeContext`) & custom hooks (`useLocalStorage`, `useApplications`).
- **Routing:** `react-router-dom` for SPA navigation.
- **Forms & Validation:** `react-hook-form` + `yup` for performant, schema-driven validation.
- **API Requests:** `axios` for fetching suggested jobs.
- **Data Visualization:** `recharts` for highly customized SVG charts.
- **Styling:** Vanilla CSS with a strong emphasis on modern SaaS design tokens (CSS variables) for seamless theming and maintainability.

## 💡 Key Design & Architecture Decisions (Viva Notes)

1. **Why Context API over Redux?** 
   For a project of this scale, Context API combined with custom hooks provides perfect state separation without the heavy boilerplate of Redux.
2. **Why Vanilla CSS + Variables?** 
   To demonstrate a deep understanding of CSS fundamentals. Using `--bg-card` and `--text-primary` tokens allows the entire app to switch themes instantly without re-rendering components.
3. **Company Logo Rendering:** 
   Instead of unreliable fallback images, the app uses a custom `helpers.js` utility that maps company names to domains and fetches high-resolution 128px icons via the Google Favicon API.
4. **Separation of Concerns:** 
   Validation logic is strictly separated into `validationSchema.js`. API calls are isolated in `services/jobService.js`. Data management lives in `useApplications.js`. This makes the codebase highly maintainable.

## 💻 How to Run

1. **Install dependencies:**
    ```bash
    npm install
    ```
2. **Start the development server:**
    ```bash
    npm start
    ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔮 Future Improvements
- **Real API Backend:** Replace `localStorage` with a Node.js/Express + MongoDB backend.
- **Authentication:** Add JWT-based login to support multiple users.
- **Email Reminders:** Integration with an email service to send follow-up reminders 3 days after an interview.
