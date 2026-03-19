"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  IndianRupee,
  Clock,
  Check,
  Star
} from "lucide-react"
import { Package as PackageType, EventType } from "@/lib/types"

// Mock data
const mockPackages: PackageType[] = [
  {
    id: "pkg1",
    name: "Premium Wedding",
    description: "Complete sangeet choreography with couple dance, family performances, and grand finale",
    eventType: "wedding",
    basePrice: 150000,
    sessionCount: 8,
    features: [
      "Personalized couple choreography",
      "Family group dance (up to 20 people)",
      "Song selection assistance",
      "Costume guidance",
      "2 backup dancers for event day",
      "Video of rehearsals"
    ],
    isActive: true,
    isPopular: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "pkg2",
    name: "Standard Wedding",
    description: "Perfect for intimate weddings with couple and close family performances",
    eventType: "wedding",
    basePrice: 80000,
    sessionCount: 5,
    features: [
      "Couple choreography",
      "Family group dance (up to 10 people)",
      "Song selection assistance",
      "Basic costume guidance"
    ],
    isActive: true,
    isPopular: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "pkg3",
    name: "Corporate Standard",
    description: "Team building through dance - perfect for annual days and corporate events",
    eventType: "corporate",
    basePrice: 75000,
    sessionCount: 5,
    features: [
      "Group choreography for up to 30 people",
      "Theme-based performance",
      "Professional music mixing",
      "Event day coordination"
    ],
    isActive: true,
    isPopular: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "pkg4",
    name: "Corporate Premium",
    description: "Large scale corporate events with multiple performances and themes",
    eventType: "corporate",
    basePrice: 150000,
    sessionCount: 10,
    features: [
      "Multiple group performances",
      "Flash mob choreography",
      "Theme-based costumes",
      "Professional video production",
      "Event day management",
      "2 backup dancers"
    ],
    isActive: true,
    isPopular: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "pkg5",
    name: "College Fest",
    description: "Competition-ready choreography for college fests and inter-college events",
    eventType: "college",
    basePrice: 45000,
    sessionCount: 6,
    features: [
      "Group choreography for up to 15 people",
      "Competition-focused training",
      "Formation and staging guidance",
      "Music mixing",
      "Costume suggestions"
    ],
    isActive: true,
    isPopular: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "pkg6",
    name: "Audition Prep",
    description: "One-on-one training for dance show auditions and competitions",
    eventType: "audition",
    basePrice: 30000,
    sessionCount: 4,
    features: [
      "Personalized 1-on-1 training",
      "Audition piece choreography",
      "Performance techniques",
      "Camera presence training",
      "Mock audition sessions"
    ],
    isActive: true,
    isPopular: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
]

const eventTypeLabels: Record<EventType, string> = {
  wedding: "Wedding",
  corporate: "Corporate",
  college: "College",
  audition: "Audition",
}

const eventTypeColors: Record<EventType, string> = {
  wedding: "bg-pink-100 text-pink-700 border-pink-200",
  corporate: "bg-blue-100 text-blue-700 border-blue-200",
  college: "bg-purple-100 text-purple-700 border-purple-200",
  audition: "bg-amber-100 text-amber-700 border-amber-200",
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageType[]>(mockPackages)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const togglePackageActive = (packageId: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId ? { ...pkg, isActive: !pkg.isActive } : pkg
    ))
  }

  const togglePackagePopular = (packageId: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId ? { ...pkg, isPopular: !pkg.isPopular } : pkg
    ))
  }

  const groupedPackages = packages.reduce((acc, pkg) => {
    if (!acc[pkg.eventType]) {
      acc[pkg.eventType] = []
    }
    acc[pkg.eventType].push(pkg)
    return acc
  }, {} as Record<EventType, PackageType[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Service Packages</h2>
          <p className="text-muted-foreground">Manage your choreography packages and pricing</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Package Name</Label>
                  <Input placeholder="e.g., Premium Wedding" />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="audition">Audition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe what this package includes..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Price (INR)</Label>
                  <Input type="number" placeholder="150000" />
                </div>
                <div className="space-y-2">
                  <Label>Number of Sessions</Label>
                  <Input type="number" placeholder="8" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea 
                  placeholder="Personalized choreography&#10;Song selection assistance&#10;Costume guidance"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="active" defaultChecked />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="popular" />
                  <Label htmlFor="popular">Mark as Popular</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Create Package
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--secondary)]/10">
                <Package className="h-5 w-5 text-[var(--secondary)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Packages</p>
                <p className="text-2xl font-semibold">{packages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold">{packages.filter(p => p.isActive).length}</p>
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
                <p className="text-sm text-muted-foreground">Popular</p>
                <p className="text-2xl font-semibold">{packages.filter(p => p.isPopular).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <IndianRupee className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Price</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(packages.reduce((sum, p) => sum + p.basePrice, 0) / packages.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Packages by Event Type */}
      {(Object.keys(groupedPackages) as EventType[]).map((eventType) => (
        <div key={eventType} className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={eventTypeColors[eventType]} variant="outline">
              {eventTypeLabels[eventType]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {groupedPackages[eventType].length} packages
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedPackages[eventType].map((pkg) => (
              <Card key={pkg.id} className={`relative ${!pkg.isActive ? 'opacity-60' : ''}`}>
                {pkg.isPopular && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-amber-500 text-white border-amber-500">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <CardDescription className="mt-1">{pkg.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-lg">{formatCurrency(pkg.basePrice)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {pkg.sessionCount} sessions
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Features:</p>
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {pkg.features.length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          +{pkg.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={pkg.isActive}
                          onCheckedChange={() => togglePackageActive(pkg.id)}
                          className="scale-75"
                        />
                        <span className="text-xs text-muted-foreground">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={pkg.isPopular}
                          onCheckedChange={() => togglePackagePopular(pkg.id)}
                          className="scale-75"
                        />
                        <span className="text-xs text-muted-foreground">Popular</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setEditingPackage(pkg)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Edit Package Dialog */}
      <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Package: {editingPackage?.name}</DialogTitle>
          </DialogHeader>
          {editingPackage && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Package Name</Label>
                  <Input defaultValue={editingPackage.name} />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select defaultValue={editingPackage.eventType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="audition">Audition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea defaultValue={editingPackage.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Price (INR)</Label>
                  <Input type="number" defaultValue={editingPackage.basePrice} />
                </div>
                <div className="space-y-2">
                  <Label>Number of Sessions</Label>
                  <Input type="number" defaultValue={editingPackage.sessionCount} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea 
                  defaultValue={editingPackage.features.join('\n')}
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="edit-active" defaultChecked={editingPackage.isActive} />
                  <Label htmlFor="edit-active">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="edit-popular" defaultChecked={editingPackage.isPopular} />
                  <Label htmlFor="edit-popular">Mark as Popular</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingPackage(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setEditingPackage(null)}>
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
