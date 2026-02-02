## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
  
This Expense Tracker Pro is a comprehensive, full-stack inspired web application built with Next.js 15 and React 19, designed to provide users with a seamless and intuitive interface for personal finance management. The project focuses on high performance, responsive design, and robust state management to help users gain complete control over their daily spending habits.

Key Technical Features:
Dynamic Data Management: The application uses React's useState and useEffect hooks to handle real-time data updates. To ensure data persistence without a backend, I implemented Local Storage integration, allowing users to close their browser and return to find their data intact.
Smart Budgeting System: I developed a logic-based budget monitoring system. It calculates monthly totals and provides visual feedback through a progress bar that changes color based on spending thresholds, alerting users when they exceed 80% or 100% of their limit.

Visual Insights: The project includes a detailed Category Breakdown section. It dynamically calculates the percentage of spending for each category (Food, Transport, Entertainment, etc.) and displays it using animated progress bars and icons.

Design & UX:
The UI is crafted with Tailwind CSS, featuring a sophisticated Dark Mode toggle and a fully responsive grid layout that adapts perfectly from mobile devices to large desktop monitors. I integrated Lucide-React for high-quality iconography and implemented custom CSS animations for a "Pro" feel. Additionally, the app includes a CSV Export feature, allowing users to download their financial data for external use in Excel or Google Sheets.

This project demonstrates my ability to build a feature-rich, production-ready React application with a strong focus on clean code, performance, and user-centric design.
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

