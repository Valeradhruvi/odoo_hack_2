import Link from "next/link";
import { ArrowRight, Box, Calendar, CheckCircle2, ChevronRight, LayoutDashboard, Settings, ShieldCheck, Users, Wrench } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/30">

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <Wrench size={18} strokeWidth={3} />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">GearGuard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/register"
              className="hidden sm:flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-zinc-100 to-white dark:from-indigo-950/30 dark:via-zinc-900 dark:to-black opacity-60 blur-3xl" />

          <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Text Side */}
              <div className="flex flex-col gap-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  v2.0 Now Live
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl lg:leading-[1.1]">
                  The ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">maintenance tracker</span> used by industry pros.
                </h1>

                <p className="max-w-xl mx-auto lg:mx-0 text-lg text-zinc-600 dark:text-zinc-400">
                  Centralize your equipment, empower your technicians, and handle breakdowns before they happen. The all-in-one workspace for modern maintenance teams.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-4">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-base font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95"
                  >
                    Get Started <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 text-base font-semibold text-zinc-900 dark:text-zinc-100 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Log in
                  </Link>
                </div>
              </div>

              {/* UI Mockup Side */}
              <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
                <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-2xl shadow-indigo-500/10">
                  <div className="rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-black overflow-hidden flex flex-col h-[400px]">
                    {/* Mock Header */}
                    <div className="h-10 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-2 bg-white dark:bg-zinc-900/50">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                      </div>
                    </div>
                    {/* Mock Kanban */}
                    <div className="flex-1 p-4 grid grid-cols-3 gap-4 overflow-hidden opacity-90">
                      {/* Col 1 */}
                      <div className="flex flex-col gap-3">
                        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
                          <div className="h-2 w-8 bg-indigo-100 dark:bg-indigo-900/30 rounded mb-2" />
                          <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-1" />
                          <div className="h-2 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded" />
                        </div>
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
                          <div className="h-2 w-8 bg-amber-100 dark:bg-amber-900/30 rounded mb-2" />
                          <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded mb-1" />
                        </div>
                      </div>
                      {/* Col 2 */}
                      <div className="flex flex-col gap-3">
                        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 ring-2 ring-indigo-500/20">
                          <div className="flex justify-between mb-2">
                            <div className="h-2 w-10 bg-red-100 dark:bg-red-900/30 rounded" />
                          </div>
                          <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-2 w-12 bg-zinc-100 dark:bg-zinc-800 rounded" />
                          </div>
                        </div>
                      </div>
                      {/* Col 3 */}
                      <div className="flex flex-col gap-3 opacity-50">
                        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
                          <div className="h-2 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded mb-2" />
                          <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white dark:bg-zinc-900 p-4 shadow-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 animate-bounce-slow">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">System Optimised</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">All systems operational</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">Everything you need to run operations</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">Built for speed and reliability, GearGuard keeps your assets running and your teams synced.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Box, title: "Central Asset DB", desc: "Track full history, warranty, and location of every machine in your facility.", color: "text-blue-500" },
                { icon: LayoutDashboard, title: "Smart Kanban", desc: "Drag-and-drop maintenance requests with auto-assignment and status tracking.", color: "text-indigo-500" },
                { icon: Calendar, title: "Preventive Schedule", desc: "Never miss a routine checkup. Calendar view keeps your team ahead of breakdowns.", color: "text-purple-500" }
              ].map((feature, i) => (
                <div key={i} className="group bg-white dark:bg-black p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                  <div className={`w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={feature.color} size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW SECTION */}
        <section className="py-16 bg-white dark:bg-black">
          <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Seamless flow from breakdown to repair.</h2>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                    <div className="flex-1 w-0.5 bg-zinc-200 dark:bg-zinc-800 my-2"></div>
                  </div>
                  <div className="pb-8">
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Request Created</h4>
                    <p className="text-zinc-500 dark:text-zinc-400">Requester reports an issue. System auto-assigns the correct team based on equipment category.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold text-sm">2</div>
                    <div className="flex-1 w-0.5 bg-zinc-200 dark:bg-zinc-800 my-2"></div>
                  </div>
                  <div className="pb-8">
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Technician Dispatched</h4>
                    <p className="text-zinc-500 dark:text-zinc-400">Tech receives notification, tracks time, and logs parts used directly from mobile.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold text-sm">3</div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Asset Restored</h4>
                    <p className="text-zinc-500 dark:text-zinc-400">Equipment marked running. Performance metrics updated instantly.</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-4">
                  {/* Mock Card 1 */}
                  <div className="bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 shadow-sm">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600">
                      <Settings size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div>
                      <div className="h-2 w-32 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                    </div>
                    <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded text-xs font-mono">NEW</div>
                  </div>
                  {/* Mock Arrow */}
                  <div className="flex justify-center text-zinc-300 dark:text-zinc-700">
                    ↓
                  </div>
                  {/* Mock Card 2 */}
                  <div className="bg-white dark:bg-black p-4 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div>
                      <div className="h-2 w-32 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                    </div>
                    <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-bold">REPAIRED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROLES SECTION */}
        <section className="py-16 bg-zinc-900 text-white">
          <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
              <div>
                <h3 className="text-lg font-bold text-indigo-400 mb-2">For Managers</h3>
                <p className="text-zinc-400">Gain specific insights into team performance and equipment health. Schedule proactive maintenance.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-400 mb-2">For Technicians</h3>
                <p className="text-zinc-400">Clear daily rosters, mobile-friendly inputs, and instant access to asset history.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-400 mb-2">For Everyone</h3>
                <p className="text-zinc-400">Simple request portal. Report issues in seconds and track progress without the chase.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="py-16 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 text-center">
          <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-8">Start managing maintenance smarter.</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto h-12 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold px-8 hover:opacity-90 transition-opacity"
              >
                Create free account
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold px-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Log in existing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-400">
        <p>© 2024 GearGuard Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}
