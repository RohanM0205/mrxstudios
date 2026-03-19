"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Star,
  Calendar,
  Mail,
  Phone,
  Award
} from "lucide-react"
import { Choreographer } from "@/lib/types"

// Mock data
const mockChoreographers: Choreographer[] = [
  {
    id: "ch1",
    name: "Ritesh More",
    email: "ritesh@mrxstudios.com",
    phone: "+91 98765 43210",
    bio: "Founder of MRX Studios with 10+ years of experience in Bollywood, contemporary, and wedding choreography. Trained under renowned choreographers and has worked with top production houses.",
    specializations: ["Bollywood", "Contemporary", "Wedding", "Corporate"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    isActive: true,
    isLead: true,
    rating: 4.9,
    totalBookings: 150,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "ch2",
    name: "Priya Desai",
    email: "priya@mrxstudios.com",
    phone: "+91 87654 32109",
    bio: "Specialist in contemporary and classical fusion dance. 7 years of experience training students for competitions and events.",
    specializations: ["Contemporary", "Classical Fusion", "College Events"],
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    isActive: true,
    isLead: false,
    rating: 4.8,
    totalBookings: 85,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z"
  },
  {
    id: "ch3",
    name: "Arjun Kapoor",
    email: "arjun@mrxstudios.com",
    phone: "+91 76543 21098",
    bio: "Hip-hop and street dance expert with experience in reality shows and corporate events. Known for high-energy performances.",
    specializations: ["Hip-Hop", "Street Dance", "Flash Mobs", "Corporate"],
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    isActive: true,
    isLead: false,
    rating: 4.7,
    totalBookings: 62,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z"
  },
  {
    id: "ch4",
    name: "Meera Singh",
    email: "meera@mrxstudios.com",
    phone: "+91 65432 10987",
    bio: "Kathak and semi-classical dance expert. Specializes in traditional wedding performances and cultural events.",
    specializations: ["Kathak", "Semi-Classical", "Wedding"],
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    isActive: false,
    isLead: false,
    rating: 4.6,
    totalBookings: 45,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z"
  },
]

export default function ChoreographersPage() {
  const [choreographers, setChoreographers] = useState<Choreographer[]>(mockChoreographers)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingChoreographer, setEditingChoreographer] = useState<Choreographer | null>(null)

  const toggleActive = (id: string) => {
    setChoreographers(prev => prev.map(ch => 
      ch.id === id ? { ...ch, isActive: !ch.isActive } : ch
    ))
  }

  const stats = {
    total: choreographers.length,
    active: choreographers.filter(c => c.isActive).length,
    totalBookings: choreographers.reduce((sum, c) => sum + c.totalBookings, 0),
    avgRating: (choreographers.reduce((sum, c) => sum + c.rating, 0) / choreographers.length).toFixed(1),
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--secondary)]/10">
                <Users className="h-5 w-5 text-[var(--secondary)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Team</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-semibold">{stats.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-semibold">{stats.avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Choreography Team</CardTitle>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Choreographer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add Choreographer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="Full name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="email@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Photo URL</Label>
                      <Input placeholder="https://..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea placeholder="Brief bio and experience..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Specializations (comma separated)</Label>
                    <Input placeholder="Bollywood, Contemporary, Wedding" />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch id="add-active" defaultChecked />
                      <Label htmlFor="add-active">Active</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="add-lead" />
                      <Label htmlFor="add-lead">Lead Choreographer</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddOpen(false)}>
                      Add Choreographer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {choreographers.map((choreographer) => (
              <Card key={choreographer.id} className={`relative ${!choreographer.isActive ? 'opacity-60' : ''}`}>
                {choreographer.isLead && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-[var(--gold)] text-[var(--primary)] border-[var(--gold)]">
                      <Award className="h-3 w-3 mr-1" />
                      Lead
                    </Badge>
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={choreographer.photoUrl} alt={choreographer.name} />
                      <AvatarFallback>{choreographer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{choreographer.name}</h3>
                          <div className="flex items-center gap-1 text-amber-500 text-sm">
                            <Star className="h-4 w-4 fill-current" />
                            <span>{choreographer.rating}</span>
                            <span className="text-muted-foreground">({choreographer.totalBookings} bookings)</span>
                          </div>
                        </div>
                        <Switch
                          checked={choreographer.isActive}
                          onCheckedChange={() => toggleActive(choreographer.id)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {choreographer.bio}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {choreographer.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {choreographer.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {choreographer.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingChoreographer(choreographer)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingChoreographer} onOpenChange={() => setEditingChoreographer(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Choreographer: {editingChoreographer?.name}</DialogTitle>
          </DialogHeader>
          {editingChoreographer && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue={editingChoreographer.name} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue={editingChoreographer.email} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={editingChoreographer.phone} />
                </div>
                <div className="space-y-2">
                  <Label>Photo URL</Label>
                  <Input defaultValue={editingChoreographer.photoUrl} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea defaultValue={editingChoreographer.bio} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Specializations (comma separated)</Label>
                <Input defaultValue={editingChoreographer.specializations.join(', ')} />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="edit-active" defaultChecked={editingChoreographer.isActive} />
                  <Label htmlFor="edit-active">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="edit-lead" defaultChecked={editingChoreographer.isLead} />
                  <Label htmlFor="edit-lead">Lead Choreographer</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingChoreographer(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setEditingChoreographer(null)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
