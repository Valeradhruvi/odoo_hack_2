# GearGuard 🛡️

![GearGuard Banner](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)

> **The ultimate maintenance tracker used by industry pros.**
> Centralize your equipment, empower your technicians, and handle breakdowns before they happen.

## 📖 Overview

**GearGuard** is a modern, all-in-one maintenance management system designed to streamline operations for maintenance teams. It creates a seamless flow from breakdown to repair, ensuring assets are kept running and performance metrics are updated instantly.

Whether you are a **Manager** needing insights, a **Technician** managing daily tasks, or a **Requester** reporting an issue, GearGuard provides a tailored experience to suit your needs.

## ✨ Key Features

### 🏢 Asset Management
- **Central Asset DB**: comprehensive tracking of equipment history, warranty, location, and specifications.
- **Ownership/Assignment**: Assign equipment to specific departments, teams, or individuals.

### 📋 Maintenance Operations
- **Smart Kanban Board**: A drag-and-drop interface for managing maintenance requests. Visualize work-in-progress and update statuses effortlessly.
- **Request Lifecycle**: Complete workflow handling from "New" -> "In Progress" -> "Repaired" or "Scrap".
- **Preventive & Corrective**: Support for both routine scheduled maintenance and emergency corrective repairs.
- **Auto-Assignment Logic**: Intelligent routing of requests to the appropriate maintenance teams based on equipment categories.

### 👥 Role-Based Access Control (RBAC)
- **Admin/Manager**: Full system oversight, team management, and analytics.
- **Technician**: Dedicated dashboard for assigned tasks, mobile-friendly inputs for logging repairs.
- **Requester**: Simplified portal for reporting issues and tracking their status without the noise.

### 📊 Dashboard & Analytics
- **Real-time Insights**: Visual charts (Recharts) for tracking key performance indicators.
- **Team Performance**: Monitor team efficiency and request resolution times.

## 🛠️ Tech Stack

This project is built with the latest web technologies for performance and scalability.

**Frontend:**
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) (accessible primitives), [Lucide React](https://lucide.dev/) (icons)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)

**Backend & Data:**
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Server State**: Next.js Server Actions

**Tools & Quality:**
- **Validation**: [Zod](https://zod.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **TypeScript**: Fully typed codebase.

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** database (local or cloud-hosted like Neon/Supabase)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/gear-guard.git
   cd gear-guard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and populate it with the necessary keys:
   ```env
   # Database connection
   DATABASE_URL="postgresql://user:password@localhost:5432/gearguard"

   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key"
   
   # Add any other provider keys (e.g., Google, GitHub if using OAuth)
   ```

4. **Initialize the Database:**
   Use Prisma to push the schema to your database.
   ```bash
   npx prisma generate
   npx prisma db push
   # or if using migrations
   npx prisma migrate dev --name init
   ```

5. **Seed the Database (Optional):**
   If you have a seed script set up:
   ```bash
   npm run seed
   ```

6. **Run the Development Server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
app/
├── (auth)/
│ ├── login/
│ │ └── page.tsx
│ └── register/
│ └── page.tsx
├── dashboard/
│ └── kanban/
│ └── page.tsx (Main Kanban)
├── equipment/
│ ├── page.tsx (List)
│ └── [id]/
│ └── page.tsx (Detail + Smart Button)
├── teams/
│ └── page.tsx
├── requests/
│ └── calendar/
│ └── page.tsx
├── reports/
│ └── page.tsx
├── api/
│ └── trpc/
│ └── [trpc]/
│ └── route.ts
├── layout.tsx
├── page.tsx (Landing/Redirect)
└── globals.css

components/
├── ui/ (shadcn components)
├── kanban/
│ ├── Board.tsx
│ ├── Column.tsx
│ └── Card.tsx
├── calendar/
│ └── CalendarView.tsx
├── forms/
│ ├── EquipmentForm.tsx
│ └── RequestForm.tsx
└── layout/
└── Navbar.tsx

lib/
├── prisma.ts
├── auth.ts
├── queries.ts
└── utils.ts

prisma/
├── schema.prisma
└── seed.ts
```

## 🗓️ Roadmap

- [x] Core Equipment & Request Management
- [x] Kanban Board Implementation
- [x] Authentication & Role Management
- [ ] Mobile App (PWA)
- [ ] Notification System (Email/SMS)
- [ ] Advanced Reporting & Export

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team Members

| Name |
|-----|------|
| Dhruvi Valera  |
| Khushi Patel |
| Prem Shah |
| Prasham Togadiya |

---

built with ❤️ by the GearGuard Team
