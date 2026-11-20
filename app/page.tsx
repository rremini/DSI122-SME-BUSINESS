import { Suspense } from "react";
import { Banknote, ShoppingBag, Users, Store } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TopProductsChart } from "@/components/dashboard/top-products-chart";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import type {
  DashboardSummary,
  DailySalesPoint,
  TopProduct,
  RecentOrder,
} from "@/types/dashboard";


const formatTHB = (value: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);

async function DashboardContent() {
  const supabase = await createClient();

  const [summaryRes, salesRes, topProductsRes, recentOrdersRes] =
    await Promise.all([
      supabase
        .from("v_dashboard_summary")
        .select("*")
        .single<DashboardSummary>(),
      supabase.from("v_sales_daily").select("*").returns<DailySalesPoint[]>(),
      supabase.from("v_top_products").select("*").returns<TopProduct[]>(),
      supabase.from("v_recent_orders").select("*").returns<RecentOrder[]>(),
    ]);

  if (
    summaryRes.error ||
    salesRes.error ||
    topProductsRes.error ||
    recentOrdersRes.error
  ) {
    return (
      <Card className="border-rose-200 bg-rose-50/50">
        <CardHeader>
          <CardTitle className="text-rose-700">
            ไม่สามารถโหลดข้อมูลจาก Supabase ได้
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-rose-600">
          กรุณาตรวจสอบว่าได้ตั้งค่า `.env.local`, รัน `mock_data.sql` และสร้าง
          Views ทั้ง 4 ตัวใน Supabase เรียบร้อยแล้ว
        </CardContent>
      </Card>
    );
  }

  const summary = summaryRes.data ?? {
    total_revenue: 0,
    total_orders: 0,
    paid_orders: 0,
    total_customers: 0,
  };
  const salesDaily = salesRes.data ?? [];
  const topProducts = topProductsRes.data ?? [];
  const recentOrders = recentOrdersRes.data ?? [];

  return (
    <div className="space-y-6">
      {/* KPI Section: REQ-1, REQ-2, REQ-3 */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ยอดขายรวม (Total Revenue)
            </CardTitle>
            <Banknote className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatTHB(Number(summary.total_revenue))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              จาก {Number(summary.paid_orders).toLocaleString()}{" "}
              ออเดอร์ที่ชำระเงินแล้ว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              คำสั่งซื้อทั้งหมด (Total Orders)
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {Number(summary.total_orders).toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              รวมทุกสถานะ (ชำระแล้ว / รอดำเนินการ / ยกเลิก)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ลูกค้าทั้งหมด (Total Customers)
            </CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {Number(summary.total_customers).toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              บัญชีลูกค้าที่ลงทะเบียนในระบบ
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Analytics Section: REQ-4 & REQ-5 */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <SalesChart data={salesDaily} />
        <TopProductsChart products={topProducts} />
      </section>

      {/* Recent Activity Section: REQ-6 */}
      <section>
        <RecentOrdersTable orders={recentOrders} />
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50/60">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight sm:text-lg">
                SME Business Intelligence
              </h1>
              <p className="text-xs text-muted-foreground">
                ภาพรวมยอดขายและสถิติร้านค้าแบบ Real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">SME Owner</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-slate-200 text-xs font-semibold text-slate-700">
                SO
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
