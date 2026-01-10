"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Loader2,
  Truck,
  Hash,
  Phone,
  Calendar,
  Mail,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { getDriverInfo } from "@/services/userServices";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DriverProfilePage() {
  const { data: session } = useSession();
  const [driverData, setDriverData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadDriverProfile = async () => {
      if (session?.user?.email) {
        try {
          const data = await getDriverInfo(session.user.email);
          setDriverData(data);
        } catch (error) {
          toast.error(
            "SYSTEM_FETCH_ERROR: Could not retrieve driver credentials.",
          );
        } finally {
          setFetching(false);
        }
      } else if (session === null) {
        setFetching(false);
      }
    };

    if (session !== undefined) loadDriverProfile();
  }, [session]);

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white dark:bg-[#0a0c12]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Syncing Terminal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0c12] transition-colors duration-300">
      {/* --- FIXED HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0c12]/80 backdrop-blur-md py-4 px-5 border-b border-slate-100 dark:border-white/5">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <User size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {driverData?.name?.split(" ")[0] || "User"}{" "}
                <span className="text-blue-600">info</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* SIGN OUT BUTTON */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="group flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 transition-all duration-200 active:scale-95"
            >
              <LogOut
                size={14}
                className="text-slate-500 group-hover:text-red-500 transition-colors"
              />
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-red-600 dark:group-hover:text-red-400">
                Exit
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* --- PAGE CONTENT --- */}
      <main className="max-w-xl mx-auto p-5 pb-32">
        <div className="bg-white dark:bg-[#11141d] rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden mt-4">
          {/* Visual Identity Section */}
          <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-600 dark:to-blue-700 text-white relative">
            <Truck className="absolute -right-8 -bottom-8 w-44 h-44 opacity-10 -rotate-12" />

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex justify-between items-start">
                <Avatar className="h-20 w-20 rounded-2xl border-4 border-white/20 shadow-2xl">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-800 text-xl font-black italic">
                    {driverData?.name?.substring(0, 2).toUpperCase() || "PC"}
                  </AvatarFallback>
                </Avatar>

                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-wider">
                    System Active
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-300 dark:text-blue-100 uppercase tracking-[0.4em]">
                  Authorized Operator
                </p>
                <h2 className="text-3xl font-black tracking-tighter leading-none">
                  {driverData?.name || "Access Denied"}
                </h2>
                <div className="flex items-center gap-2 pt-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-[9px] font-black uppercase rounded">
                    <ShieldCheck size={10} />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Information */}
          <div className="p-8 grid grid-cols-1 gap-6 bg-white dark:bg-[#11141d]">
            <div className="grid grid-cols-2 gap-4">
              <MetricBox
                label="Vehicle ID"
                value={driverData?.vehicle || "NOT_ASSIGNED"}
                icon={<Hash size={14} />}
              />
              <MetricBox
                label="Comm Line"
                value={driverData?.phone || "NO_LINK"}
                icon={<Phone size={14} />}
              />
            </div>

            <div className="h-px bg-slate-100 dark:bg-white/5 w-full" />

            <div className="space-y-4">
              <InfoRow
                icon={<Mail size={14} />}
                label="Network Email"
                value={session?.user?.email || "UNKNOWN"}
              />
              <InfoRow
                icon={<Calendar size={14} />}
                label="Registry Date"
                value={
                  driverData?.updatedAt
                    ? new Date(driverData.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "New Unit"
                }
              />
              <InfoRow
                icon={<Truck size={14} />}
                label="Service Status"
                value={driverData?.status || "On Standby"}
              />
            </div>
          </div>

          {/* Footer of the card */}
          <div className="bg-slate-50 dark:bg-white/[0.02] p-6 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
              Property of SudanPC Logistics Section
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

{
  /* --- REUSABLE SUB-COMPONENTS --- */
}

function MetricBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-blue-500/30 transition-colors">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-sm font-black text-slate-900 dark:text-white font-mono truncate">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2">
        <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
        {value}
      </span>
    </div>
  );
}
