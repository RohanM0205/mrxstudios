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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit,
  Calendar,
  CalendarCheck,
  CalendarX,
  IndianRupee,
  Plus,
  MapPin,
  Users,
  Clock
} from "lucide-react"
import { Booking, BookingStatus } from "@/lib/types"

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: "B001",
    leadId: "1",
    clientName: "Priya Sharma",
    clientEmail: "priya@example.com",
    clientPhone: "+91 98765 43210",
    eventType: "wedding",
    eventDate: "2024-03-15",
    eventVenue: "Grand Hyatt, Mumbai",
    packageId: "pkg1",
    packageName: "Premium Wedding",
    totalAmount: 150000,
    advanceAmount: 50000,
    balanceAmount: 100000,
    status: "confirmed",
    numberOfSessions: 8,
    specialRequirements: "Couple dance + Family dance for sangeet",
    choreographerId: "ch1",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:00:00Z"
  },
  {
    id: "B002",
    leadId: "2",
    clientName: "Rahul Mehta",
    clientEmail: "rahul@company.com",
    clientPhone: "+91 87654 32109",
    eventType: "corporate",
    eventDate: "2024-02-28",
    eventVenue: "Oberoi Business Center, Delhi",
    packageId: "pkg2",
    packageName: "Corporate Standard",
    totalAmount: 75000,
    advanceAmount: 25000,
    balanceAmount: 50000,
    status: "in_progress",
    numberOfSessions: 5,
    specialRequirements: "Flash mob style performance",
    choreographerId: "ch2",
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-18T09:00:00Z"
  },
  {
    id: "B003",
    leadId: "3",
    clientName: "Sneha Patel",
    clientEmail: "sneha@college.edu",
    clientPhone: "+91 76543 21098",
    eventType: "college",
    eventDate: "2024-04-10",
    eventVenue: "IIT Bombay Campus",
    packageId: "pkg3",
    packageName: "College Fest",
    totalAmount: 45000,
    advanceAmount: 15000,
    balanceAmount: 30000,
    status: "pending",
    numberOfSessions: 6,
    specialRequirements: "Group of 15 students, competition prep",
    choreographerId: "ch1",
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-13T16:45:00Z"
  },
  {
    id: "B004",
    leadId: "4",
    clientName: "Amit Kumar",
    clientEmail: "amit@gmail.com",
    clientPhone: "+91 65432 10987",
    eventType: "audition",
    eventDate: "2024-02-20",
    eventVenue: "MRX Studio",
    packageId: "pkg4",
    packageName: "Audition Prep",
    totalAmount: 30000,
    advanceAmount: 30000,
    balanceAmount: 0,
    status: "completed",
    numberOfSessions: 4,
    specialRequirements: "Dance India Dance audition preparation",
    choreographerId: "ch1",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-02-21T18:00:00Z"
  },
  {
    id: "B005",
    leadId: "6",
    clientName: "Vikram Singh",
    clientEmail: "vikram@example.com",
    clientPhone: "+91 43210 98765",
    eventType: "wedding",
    eventDate: "2024-01-20",
    eventVenue: "Taj Palace, Jaipur",
    packageId: "pkg1",
    packageName: "Premium Wedding",
    totalAmount: 150000,
    advanceAmount: 50000,
    balanceAmount: 100000,
    status: "cancelled",
    numberOfSessions: 8,
    specialRequirements: "Destination wedding sangeet",
    choreographerId: "ch2",
    createdAt: "2024-01-05T11:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z"
  },
]

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-purple-100 text-purple-700 border-purple-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
}

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

export default function BookingsPage() {
  const [bookings] = useState<Booking[]>(mockBookings)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredBookings = bookings.filter(booking =>
    booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.eventVenue.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    inProgress: bookings.filter(b => b.status === "in_progress").length,
    revenue: bookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + b.totalAmount, 0),
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--secondary)]/10">
                <Calendar className="h-5 w-5 text-[var(--secondary)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <CalendarCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-semibold">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-semibold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold">{formatCurrency(stats.revenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Bookings</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.clientName}</p>
                      <p className="text-sm text-muted-foreground">{booking.clientPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {booking.eventVenue.length > 20 
                          ? booking.eventVenue.substring(0, 20) + "..." 
                          : booking.eventVenue}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{booking.packageName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {booking.numberOfSessions} sessions
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{formatCurrency(booking.totalAmount)}</p>
                      {booking.balanceAmount > 0 && (
                        <p className="text-xs text-amber-600">
                          Balance: {formatCurrency(booking.balanceAmount)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[booking.status]} variant="outline">
                      {statusLabels[booking.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewBooking(booking)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Sessions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IndianRupee className="h-4 w-4 mr-2" />
                          Record Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <CalendarX className="h-4 w-4 mr-2" />
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={statusColors[selectedBooking.status]} variant="outline">
                  {statusLabels[selectedBooking.status]}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(selectedBooking.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Client Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Name</label>
                      <p className="font-medium">{selectedBooking.clientName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium">{selectedBooking.clientEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Phone</label>
                      <p className="font-medium">{selectedBooking.clientPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Event Details</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Event Type</label>
                      <p className="font-medium capitalize">{selectedBooking.eventType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Date</label>
                      <p className="font-medium">{new Date(selectedBooking.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Venue</label>
                      <p className="font-medium">{selectedBooking.eventVenue}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Package Details</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Package</label>
                      <p className="font-medium">{selectedBooking.packageName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Sessions</label>
                      <p className="font-medium">{selectedBooking.numberOfSessions} sessions</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Payment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-medium">{formatCurrency(selectedBooking.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Advance Paid</span>
                      <span className="font-medium text-green-600">{formatCurrency(selectedBooking.advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">Balance Due</span>
                      <span className="font-semibold text-amber-600">{formatCurrency(selectedBooking.balanceAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequirements && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Special Requirements</h3>
                  <p className="p-3 bg-muted rounded-lg">{selectedBooking.specialRequirements}</p>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Sessions
                </Button>
                <Button>
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
