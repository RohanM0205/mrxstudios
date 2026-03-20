"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Plus,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Receipt
} from "lucide-react"
import { Payment, PaymentStatus, PaymentMethod } from "@/lib/types"

// Mock data
const mockPayments: Payment[] = [
  {
    id: "P001",
    bookingId: "B001",
    clientName: "Priya Sharma",
    amount: 50000,
    paymentMethod: "upi",
    transactionId: "UPI123456789",
    status: "completed",
    paymentDate: "2024-01-15T10:30:00Z",
    notes: "Advance payment for wedding choreography",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:35:00Z"
  },
  {
    id: "P002",
    bookingId: "B002",
    clientName: "Rahul Mehta",
    amount: 25000,
    paymentMethod: "bank_transfer",
    transactionId: "NEFT987654321",
    status: "completed",
    paymentDate: "2024-01-14T14:00:00Z",
    notes: "Corporate event advance",
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-14T15:00:00Z"
  },
  {
    id: "P003",
    bookingId: "B003",
    clientName: "Sneha Patel",
    amount: 15000,
    paymentMethod: "cash",
    status: "completed",
    paymentDate: "2024-01-13T16:45:00Z",
    notes: "College fest booking advance",
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-13T16:45:00Z"
  },
  {
    id: "P004",
    bookingId: "B004",
    clientName: "Amit Kumar",
    amount: 30000,
    paymentMethod: "upi",
    transactionId: "UPI567890123",
    status: "completed",
    paymentDate: "2024-01-10T09:15:00Z",
    notes: "Full payment for audition prep",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:20:00Z"
  },
  {
    id: "P005",
    bookingId: "B001",
    clientName: "Priya Sharma",
    amount: 50000,
    paymentMethod: "bank_transfer",
    status: "pending",
    notes: "Second installment - Due before event",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: "P006",
    bookingId: "B002",
    clientName: "Rahul Mehta",
    amount: 50000,
    paymentMethod: "cheque",
    status: "pending",
    notes: "Final payment for corporate event",
    createdAt: "2024-01-22T00:00:00Z",
    updatedAt: "2024-01-22T00:00:00Z"
  },
  {
    id: "P007",
    bookingId: "B005",
    clientName: "Vikram Singh",
    amount: 50000,
    paymentMethod: "upi",
    transactionId: "UPI111222333",
    status: "refunded",
    paymentDate: "2024-01-05T11:00:00Z",
    notes: "Refunded due to booking cancellation",
    createdAt: "2024-01-05T11:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z"
  },
]

const statusColors: Record<PaymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  failed: "bg-red-100 text-red-700 border-red-200",
  refunded: "bg-purple-100 text-purple-700 border-purple-200",
}

const methodLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  card: "Card",
}

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | PaymentStatus>("all")
  const [isRecordOpen, setIsRecordOpen] = useState(false)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const stats = {
    totalReceived: payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    refundedAmount: payments.filter(p => p.status === "refunded").reduce((sum, p) => sum + p.amount, 0),
    transactionCount: payments.length,
  }

  // Calculate this month's revenue (mock calculation)
  const thisMonthRevenue = 120000
  const lastMonthRevenue = 95000
  const revenueChange = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-semibold">{formatCurrency(stats.totalReceived)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold">{formatCurrency(stats.pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingDown className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Refunded</p>
                <p className="text-2xl font-semibold">{formatCurrency(stats.refundedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--secondary)]/10">
                <TrendingUp className="h-5 w-5 text-[var(--secondary)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold">{formatCurrency(thisMonthRevenue)}</p>
                  <Badge className={revenueChange >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {revenueChange >= 0 ? "+" : ""}{revenueChange.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Payment History</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record New Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Booking</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select booking" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B001">B001 - Priya Sharma (Balance: 1,00,000)</SelectItem>
                          <SelectItem value="B002">B002 - Rahul Mehta (Balance: 50,000)</SelectItem>
                          <SelectItem value="B003">B003 - Sneha Patel (Balance: 30,000)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Amount (INR)</Label>
                        <Input type="number" placeholder="50000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Payment Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Transaction ID (optional)</Label>
                        <Input placeholder="UPI/NEFT reference" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes (optional)</Label>
                      <Input placeholder="Payment notes..." />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsRecordOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsRecordOpen(false)}>
                        Record Payment
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                  <TableCell className="font-medium">{payment.clientName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.bookingId}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{methodLabels[payment.paymentMethod]}</Badge>
                  </TableCell>
                  <TableCell>
                    {payment.paymentDate 
                      ? new Date(payment.paymentDate).toLocaleDateString()
                      : <span className="text-muted-foreground">Pending</span>
                    }
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[payment.status]} variant="outline">
                      {payment.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {payment.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {payment.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                      {payment.status === "refunded" && <TrendingDown className="h-3 w-3 mr-1" />}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Receipt className="h-4 w-4" />
                      </Button>
                      {payment.status === "pending" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Payments Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments
              .filter(p => p.status === "pending")
              .map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border bg-yellow-50/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-yellow-100">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{payment.clientName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {payment.bookingId} - {payment.notes}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        via {methodLabels[payment.paymentMethod]}
                      </p>
                    </div>
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Received
                    </Button>
                  </div>
                </div>
              ))}
            {payments.filter(p => p.status === "pending").length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No pending payments
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
