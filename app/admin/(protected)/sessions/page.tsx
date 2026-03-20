"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2
} from "lucide-react"
import { Session, SessionStatus } from "@/lib/types"

// Mock data
const mockSessions: Session[] = [
  {
    id: "s1",
    bookingId: "B001",
    clientName: "Priya Sharma",
    date: "2024-01-20",
    startTime: "10:00",
    endTime: "12:00",
    venue: "MRX Studio - Main Hall",
    choreographerId: "ch1",
    choreographerName: "Ritesh More",
    status: "completed",
    notes: "First session - Couple choreography basics",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T12:30:00Z"
  },
  {
    id: "s2",
    bookingId: "B001",
    clientName: "Priya Sharma",
    date: "2024-01-22",
    startTime: "10:00",
    endTime: "12:00",
    venue: "MRX Studio - Main Hall",
    choreographerId: "ch1",
    choreographerName: "Ritesh More",
    status: "completed",
    notes: "Second session - Advanced steps",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-22T12:30:00Z"
  },
  {
    id: "s3",
    bookingId: "B002",
    clientName: "Rahul Mehta",
    date: "2024-01-25",
    startTime: "14:00",
    endTime: "17:00",
    venue: "Client Office - Mumbai",
    choreographerId: "ch3",
    choreographerName: "Arjun Kapoor",
    status: "scheduled",
    notes: "Corporate flash mob training - Group of 30",
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-14T14:00:00Z"
  },
  {
    id: "s4",
    bookingId: "B001",
    clientName: "Priya Sharma",
    date: "2024-01-25",
    startTime: "10:00",
    endTime: "12:00",
    venue: "MRX Studio - Main Hall",
    choreographerId: "ch1",
    choreographerName: "Ritesh More",
    status: "scheduled",
    notes: "Third session - Family group practice",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "s5",
    bookingId: "B003",
    clientName: "Sneha Patel",
    date: "2024-01-26",
    startTime: "16:00",
    endTime: "19:00",
    venue: "IIT Bombay - Auditorium",
    choreographerId: "ch2",
    choreographerName: "Priya Desai",
    status: "scheduled",
    notes: "Competition prep - Group formations",
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-13T16:45:00Z"
  },
  {
    id: "s6",
    bookingId: "B002",
    clientName: "Rahul Mehta",
    date: "2024-01-23",
    startTime: "14:00",
    endTime: "17:00",
    venue: "Client Office - Mumbai",
    choreographerId: "ch3",
    choreographerName: "Arjun Kapoor",
    status: "cancelled",
    notes: "Cancelled due to venue unavailability",
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-22T10:00:00Z"
  },
]

const statusColors: Record<SessionStatus, string> = {
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  rescheduled: "bg-amber-100 text-amber-700 border-amber-200",
}

const statusIcons: Record<SessionStatus, React.ReactNode> = {
  scheduled: <Clock className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  rescheduled: <AlertCircle className="h-4 w-4" />,
}

// Generate calendar days
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()
  
  const days: (number | null)[] = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null)
  }
  
  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  return days
}

export default function SessionsPage() {
  const [sessions] = useState<Session[]>(mockSessions)
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)) // January 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const calendarDays = generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth())
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getSessionsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return sessions.filter(s => s.date === dateStr)
  }

  const selectedDateSessions = selectedDate 
    ? sessions.filter(s => s.date === selectedDate)
    : []

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === "scheduled").length,
    completed: sessions.filter(s => s.status === "completed").length,
    cancelled: sessions.filter(s => s.status === "cancelled").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--secondary)]/10">
                <Calendar className="h-5 w-5 text-[var(--secondary)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-semibold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-semibold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-semibold">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Session Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[140px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }
                
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const daySessions = getSessionsForDate(day)
                const isSelected = selectedDate === dateStr
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square p-1 rounded-lg border transition-colors ${
                      isSelected 
                        ? 'border-[var(--secondary)] bg-[var(--secondary)]/10' 
                        : 'border-transparent hover:bg-muted'
                    }`}
                  >
                    <div className="h-full flex flex-col">
                      <span className={`text-sm ${isSelected ? 'font-semibold' : ''}`}>{day}</span>
                      {daySessions.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-auto justify-center">
                          {daySessions.slice(0, 3).map(session => (
                            <div
                              key={session.id}
                              className={`w-2 h-2 rounded-full ${
                                session.status === 'completed' ? 'bg-green-500' :
                                session.status === 'cancelled' ? 'bg-red-500' :
                                'bg-blue-500'
                              }`}
                            />
                          ))}
                          {daySessions.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{daySessions.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Scheduled</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Cancelled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {selectedDate 
                  ? new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : "Select a Date"
                }
              </CardTitle>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule New Session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Booking</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select booking" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B001">B001 - Priya Sharma (Wedding)</SelectItem>
                          <SelectItem value="B002">B002 - Rahul Mehta (Corporate)</SelectItem>
                          <SelectItem value="B003">B003 - Sneha Patel (College)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" defaultValue={selectedDate || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label>Choreographer</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ch1">Ritesh More</SelectItem>
                            <SelectItem value="ch2">Priya Desai</SelectItem>
                            <SelectItem value="ch3">Arjun Kapoor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input type="time" />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Venue</Label>
                      <Input placeholder="Enter venue" />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea placeholder="Session notes..." />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddOpen(false)}>
                        Schedule Session
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDateSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {selectedDate ? "No sessions scheduled" : "Click on a date to view sessions"}
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateSessions.map(session => (
                  <div key={session.id} className="p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{session.clientName}</h4>
                        <p className="text-xs text-muted-foreground">Booking: {session.bookingId}</p>
                      </div>
                      <Badge className={statusColors[session.status]} variant="outline">
                        {statusIcons[session.status]}
                        <span className="ml-1 capitalize">{session.status}</span>
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {session.venue}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3 w-3" />
                        {session.choreographerName}
                      </div>
                    </div>
                    {session.notes && (
                      <p className="text-xs text-muted-foreground mt-2 p-2 bg-background rounded">
                        {session.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      {session.status === "scheduled" && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-600">
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions
              .filter(s => s.status === "scheduled")
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(session => (
                <div key={session.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 text-center p-2 bg-muted rounded-lg min-w-[60px]">
                    <div className="text-lg font-semibold">
                      {new Date(session.date).getDate()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{session.clientName}</h4>
                      <Badge variant="outline" className="text-xs">{session.bookingId}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.venue.length > 25 ? session.venue.substring(0, 25) + '...' : session.venue}
                      </div>
                    </div>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{session.choreographerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
