🍽️ Restaurant Analytics Dashboard

A full-stack analytics dashboard designed for restaurant platforms. The project visualizes restaurant operations, orders, and trends through modern charts, dashboards, and reusable UI components.

🚀 Features

Restaurant Dashboard: Overview of restaurant performance.

Trends Dashboard: Analyze order trends, sales, and customer insights.

Reusable Components: Built with shadcn/ui and Tailwind CSS for modern UI.

Responsive Design: Optimized for desktop and mobile.

Charts & Visualizations: Data-driven insights using custom chart components.

Theme Support: Light/dark theme support with theme provider.

🛠️ Tech Stack

Frontend Framework: Next.js
 + React

Language: TypeScript

Styling: Tailwind CSS
 + PostCSS

UI Library: shadcn/ui

Charts: Custom chart components for analytics

Package Manager: pnpm

📂 Project Structure
restaurant-analytics/
│── app/
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│
│── components/
│   ├── restaurant-dashboard.tsx # Main dashboard
│   ├── restaurant-trends-dashboard.tsx # Trends visualization
│   ├── theme-provider.tsx       # Dark/Light theme handling
│   └── ui/                      # Reusable UI components (buttons, cards, dialogs, charts, etc.)
│
│── .gitignore                   # Git ignore rules
│── package.json                 # Dependencies & scripts
│── pnpm-lock.yaml               # Package lock file
│── postcss.config.mjs           # PostCSS configuration
│── tailwind.config.js           # Tailwind setup
│── tsconfig.json                # TypeScript config
│── next.config.mjs              # Next.js configuration

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/restaurant-analytics.git
cd restaurant-analytics

2️⃣ Install dependencies

Using pnpm (recommended):

pnpm install


Or with npm:

npm install

3️⃣ Run the development server
pnpm dev


Now open http://localhost:3000
 in your browser.

📊 Usage

Navigate to the Restaurant Dashboard to view overall performance.

Explore the Trends Dashboard for insights on orders, sales, and customer behavior.

Switch between dark/light themes using the theme provider.

🤝 Contributing

Fork the repository

Create a feature branch (git checkout -b feature-name)

Commit changes (git commit -m "Add feature")

Push to branch (git push origin feature-name)

Open a Pull Request

📜 License

This project is licensed under the MIT License.
