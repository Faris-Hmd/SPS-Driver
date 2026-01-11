"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { getOrdersWh } from "@/services/ordersServices";
import { getDriverInfo } from "@/services/userServices";
import { useState, useMemo } from "react";
import {
  Loader2,
  MapPin,
  Calendar,
  CheckCircle2,
  Truck,
  Clock,
  Package,
  CalendarDays,
  DollarSign,
} from "lucide-react";
import { OrderData } from "@/types/productsTypes";

type SortOption = "date" | "value";

export default function HistoryPage() {
  const { data: session } = useSession();
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filterDelivered, setFilterDelivered] = useState(false);

  const { data: driver } = useSWR(
    session?.user?.email ? ["driver-info", session.user.email] : null,
    ([, email]) => getDriverInfo(email),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  const { data: orders, isLoading } = useSWR(
    driver?.id ? ["driver-orders", driver.id] : null,
    async ([, driverId]) =>
      await getOrdersWh([{ field: "driverId", op: "==", val: driverId }]),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  const processedOrders = useMemo(() => {
    if (!orders) return [];

    // 1. Filter
    let result = filterDelivered
      ? orders.filter((o) => o.status === "Delivered")
      : orders;

    // 2. Sort
    return [...result].sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return b.totalAmount - a.totalAmount;
    });
  }, [orders, sortBy, filterDelivered]);

  if (!session || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white dark:bg-[#0a0c12]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">
          Accessing Terminal
          <br />
          Archive...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0a0c12] pb-10">
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0a0c12] p-4 shadow">
        <div className="max-w-xl mx-auto flex  items-center justify-between gap-2">
          {/* Centered Title */}
          <div className="text-center">
            <h1 className="text-xl font-black dark:text-white uppercase ">
              History <span className="text-blue-600">Logs</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Terminal Archive
            </p>
          </div>

          {/* Centered Segmented Control */}
          <div className="w-full max-w-[230px] flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
            <button
              onClick={() => setSortBy("date")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                sortBy === "date"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <CalendarDays size={14} />
              Recent
            </button>
            <button
              onClick={() => setSortBy("value")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                sortBy === "value"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <DollarSign size={14} />
              Value
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto p-4">
        {processedOrders.length > 0 ? (
          <OrderHistory orders={processedOrders} />
        ) : (
          <div className="py-20 text-center opacity-40">
            <Package className="mx-auto mb-4" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest">
              No matching logs found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderHistory({ orders }: { orders: OrderData[] }) {
  return (
    <div className="space-y-4 pb-20">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-[#11141d] border border-slate-100 dark:border-white/5 rounded-[2rem] overflow-hidden transition-all hover:border-blue-500/30 shadow-sm"
        >
          {/* Top Bar: Status & ID */}
          <div className="px-6 py-4 border-b border-slate-50 dark:border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  order.status === "Delivered"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {order.status === "Delivered" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Truck size={16} />
                )}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Order ID
                </p>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase">
                  {order.id.slice(0, 8)}
                </p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter italic border ${
                order.status === "Delivered"
                  ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
                  : "border-blue-500/20 text-blue-500 bg-blue-500/5"
              }`}
            >
              {order.status}
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Customer & Logistics */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-slate-400">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Destination
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {order.customer_name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    {order.shippingInfo?.city}, {order.shippingInfo?.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <div>
                    <p className="text-[8px] font-black uppercase text-slate-400">
                      Created
                    </p>
                    <p className="text-[10px] font-bold dark:text-slate-300">
                      {new Date(order.createdAt).toLocaleDateString()} /{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {order.deliveredAt && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-500" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-slate-400">
                        Delivered
                      </p>
                      <p className="text-[10px] font-bold text-emerald-500">
                        {new Date(order.deliveredAt).toLocaleDateString()} /{" "}
                        {new Date(order.deliveredAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Products List */}
            <div className="bg-slate-50 dark:bg-white/[0.02] rounded-2xl p-4 border border-slate-100 dark:border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <Package size={12} /> Cargo Manifest
              </p>
              <div className="space-y-2">
                {order.productsList.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded text-[9px] font-black">
                        {product.p_qu}x
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                        {product.p_name}
                      </span>
                    </div>
                    <span className="font-mono text-blue-600 font-black">
                      ${product.p_cost.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between items-end">
                <p className="text-[9px] font-black uppercase text-slate-400 italic">
                  Total Value
                </p>
                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                  ${order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
