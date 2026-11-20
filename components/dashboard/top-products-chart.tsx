'use client';

import {
  Bar,
  BarChart,
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
import { Badge } from '@/components/ui/badge';
import type { TopProduct } from '@/types/dashboard';

const formatTHB = (value: number) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(value);

export function TopProductsChart({ products }: { products: TopProduct[] }) {
  const chartData = products.map((p) => ({
    name: p.name,
    quantity: Number(p.total_quantity),
    revenue: Number(p.total_revenue),
  }));

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>5 อันดับสินค้าขายดี (Top Products)</CardTitle>
        <CardDescription>จัดอันดับตามจำนวนชิ้นที่ขายได้จริง</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {products.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
            ยังไม่มีข้อมูลสินค้าขายดี
          </div>
        ) : (
          <>
            <div className="h-[190px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#334155' }}
                  />
                  <Tooltip
                    formatter={(value) => [`${Number(value ?? 0).toLocaleString()} ชิ้น`, 'จำนวนขาย']}
                    contentStyle={{
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="quantity" fill="#0f172a" radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5 border-t pt-4">
              {products.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {index + 1}
                    </span>
                    <span className="truncate font-medium">{product.name}</span>
                    <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="font-semibold">
                      {Number(product.total_quantity).toLocaleString()} ชิ้น
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({formatTHB(Number(product.total_revenue))})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}