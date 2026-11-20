'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { DailySalesPoint } from '@/types/dashboard';

type RangeMode = '30d' | '90d' | 'monthly';

const formatTHB = (value: number) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(value);

export function SalesChart({ data }: { data: DailySalesPoint[] }) {
  const [range, setRange] = useState<RangeMode>('30d');

  const chartData = useMemo(() => {
    if (!data.length) return [];

    if (range === 'monthly') {
      const monthlyMap = new Map<string, { label: string; revenue: number; orders: number }>();
      for (const item of data) {
        const monthKey = item.sale_date.slice(0, 7); // YYYY-MM
        const existing = monthlyMap.get(monthKey) ?? {
          label: new Date(`${monthKey}-01`).toLocaleDateString('th-TH', {
            month: 'short',
            year: '2-digit',
          }),
          revenue: 0,
          orders: 0,
        };
        existing.revenue += Number(item.revenue);
        existing.orders += Number(item.order_count);
        monthlyMap.set(monthKey, existing);
      }
      return Array.from(monthlyMap.values());
    }

    const days = range === '30d' ? 30 : 90;
    return data.slice(-days).map((item) => ({
      label: new Date(item.sale_date).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
      }),
      revenue: Number(item.revenue),
      orders: Number(item.order_count),
    }));
  }, [data, range]);

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>แนวโน้มยอดขาย (Sales Analytics)</CardTitle>
          <CardDescription>ยอดขายเฉพาะคำสั่งซื้อที่ชำระเงินแล้ว</CardDescription>
        </div>
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: '30d', label: '30 วัน' },
              { id: '90d', label: '90 วัน' },
              { id: 'monthly', label: 'รายเดือน' },
            ] as const
          ).map((item) => (
            <Button
              key={item.id}
              variant={range === item.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRange(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            ยังไม่มีข้อมูลยอดขายในช่วงเวลานี้
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  minTickGap={20}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(v) => `฿${(Number(v) / 1000).toFixed(0)}k`}
                  width={56}
                />
                <Tooltip
                  formatter={(value) => [formatTHB(Number(value ?? 0)), 'ยอดขาย']}
                  contentStyle={{
                    borderRadius: '8px',
                    borderColor: '#e2e8f0',
                    fontSize: '13px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f172a"
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}