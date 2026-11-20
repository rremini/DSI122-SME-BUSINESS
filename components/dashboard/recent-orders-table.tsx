import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { RecentOrder } from '@/types/dashboard';

const STATUS_STYLE: Record<RecentOrder['status'], { label: string; className: string }> = {
  paid: {
    label: 'ชำระแล้ว',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  pending: {
    label: 'รอดำเนินการ',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  cancelled: {
    label: 'ยกเลิก',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};

const formatTHB = (value: number) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(value);

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>คำสั่งซื้อล่าสุด (Recent Orders)</CardTitle>
        <CardDescription>แสดง 10 รายการล่าสุดเรียงตามเวลาสั่งซื้อ</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            ยังไม่มีรายการคำสั่งซื้อในระบบ
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เลขที่คำสั่งซื้อ</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วัน-เวลา</TableHead>
                  <TableHead className="text-right">ยอดรวม</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const statusCfg = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {order.order_no}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.customer_email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusCfg.className}>
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDateTime(order.ordered_at)}
                      </TableCell>
                      <TableCell className="text-right font-semibold whitespace-nowrap">
                        {formatTHB(Number(order.total_amount))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}