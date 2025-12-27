import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStats, getRecentRequests } from "@/lib/actions/requests";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, Calendar, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard/kanban");
  }

  const [stats, recentRequests] = await Promise.all([
    getDashboardStats(Number(session.user.id), session.user.role),
    getRecentRequests(6, Number(session.user.id), session.user.role),
  ]);

  const user = session.user;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Role-specific configuration
  const roleConfig = {
    ADMIN: {
      title: "System Overview",
      subtitle: "Global operational health and request lifecycle.",
      activityHeader: "Central Workflow",
    },
    TECHNICIAN: {
      title: "Technician Deck",
      subtitle: "Your active assignments and maintenance queue.",
      activityHeader: "My Maintenance Track",
    },
    REQUESTER: {
      title: "Employee Portal",
      subtitle: "Track your machinery health and service requests.",
      activityHeader: "My Recent Support",
    }
  };

  const config = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.REQUESTER;

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
            {greeting}, <span className="text-indigo-600 dark:text-indigo-400">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-lg font-bold text-zinc-500 dark:text-zinc-400 italic">
            {config.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/requests/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-2xl font-black shadow-2xl shadow-indigo-500/30 transition-all hover:scale-[1.03] active:scale-[0.98] group">
              <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform" />
              {user.role === "REQUESTER" ? "Request Service" : "New Request"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">
            {config.title}
          </h2>
        </div>
        <DashboardStats stats={stats} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">
              {config.activityHeader}
            </h2>
          </div>
          <RecentRequests requests={recentRequests} />
        </section>

        {/* Quick Shortcuts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">Engine Links</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: "Kanban Board", href: "/dashboard/kanban", icon: LayoutDashboard, desc: "Manage active workflows", roles: ["ADMIN", "TECHNICIAN"] },
              { name: "Schedules", href: "/requests/calendar", icon: Calendar, desc: "Preventive maintenance", roles: ["ADMIN", "TECHNICIAN", "REQUESTER"] },
              { name: "All Requests", href: "/requests", icon: BarChart3, desc: "Data-driven insights", roles: ["ADMIN", "TECHNICIAN", "REQUESTER"] },
            ].filter(item => item.roles.includes(user.role)).map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="glass p-6 rounded-3xl border-none transition-all duration-300 hover:bg-white dark:hover:bg-white/5 group relative overflow-hidden flex items-center gap-5 shadow-lg group">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-indigo-500/5">
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-indigo-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold text-zinc-500 opacity-60">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight size={18} className="text-zinc-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>

          {/* Pro Tip/Banner */}
          <div className="mt-8 p-8 rounded-[32px] bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group border border-white/10">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Infrastructure Tip</span>
              <h4 className="text-lg font-black mt-2 mb-4 leading-tight">Optimize your preventive maintenance schedule.</h4>
              <p className="text-sm font-medium opacity-80 leading-relaxed mb-6">
                Preventive tasks reduce equipment downtime by <span className="font-black underline decoration-white/30 underline-offset-4 tracking-tight">up to 35%</span> when scheduled appropriately.
              </p>
              <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-black rounded-2xl py-6 shadow-xl shadow-black/10">
                Analyze Performance
              </Button>
            </div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
        </section>
      </div>
    </div>
  );
}
