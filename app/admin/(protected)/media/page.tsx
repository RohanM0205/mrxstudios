"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Eye,
  Star,
  StarOff,
  Filter,
  Grid3X3,
  List,
  Play
} from "lucide-react"
import { EventType } from "@/lib/types"

interface MediaItem {
  id: string
  type: "video" | "image"
  url: string
  thumbnailUrl: string
  title: string
  description: string
  eventType: EventType
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

// Mock data
const mockMedia: MediaItem[] = [
  {
    id: "m1",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400",
    title: "Sharma Family Sangeet - Wedding 2024",
    description: "Beautiful sangeet performance with 50+ family members",
    eventType: "wedding",
    isFeatured: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "m2",
    type: "image",
    url: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400",
    title: "Corporate Flash Mob - Tech Summit",
    description: "Surprise flash mob performance at annual tech summit",
    eventType: "corporate",
    isFeatured: false,
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-14T14:00:00Z"
  },
  {
    id: "m3",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400",
    title: "IIT Bombay Fest Winners",
    description: "1st place winning performance at college dance competition",
    eventType: "college",
    isFeatured: true,
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-13T16:45:00Z"
  },
  {
    id: "m4",
    type: "image",
    url: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400",
    title: "Couple Dance Practice",
    description: "Behind the scenes from wedding rehearsals",
    eventType: "wedding",
    isFeatured: false,
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z"
  },
  {
    id: "m5",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400",
    title: "Dance India Dance Audition Prep",
    description: "Our student's journey to reality show auditions",
    eventType: "audition",
    isFeatured: true,
    createdAt: "2024-01-10T11:00:00Z",
    updatedAt: "2024-01-10T11:00:00Z"
  },
  {
    id: "m6",
    type: "image",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400",
    title: "Mehndi Night Celebration",
    description: "Traditional dance performances at mehndi ceremony",
    eventType: "wedding",
    isFeatured: false,
    createdAt: "2024-01-08T15:30:00Z",
    updatedAt: "2024-01-08T15:30:00Z"
  },
]

const eventTypeLabels: Record<EventType, string> = {
  wedding: "Wedding",
  corporate: "Corporate",
  college: "College",
  audition: "Audition",
  guest_performance: "Guest Performance",
}

const eventTypeColors: Record<EventType, string> = {
  wedding: "bg-pink-100 text-pink-700 border-pink-200",
  corporate: "bg-blue-100 text-blue-700 border-blue-200",
  college: "bg-purple-100 text-purple-700 border-purple-200",
  audition: "bg-amber-100 text-amber-700 border-amber-200",
  guest_performance: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>(mockMedia)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<"all" | "video" | "image">("all")
  const [filterEvent, setFilterEvent] = useState<"all" | EventType>("all")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null)

  const filteredMedia = media.filter(item => {
    if (filterType !== "all" && item.type !== filterType) return false
    if (filterEvent !== "all" && item.eventType !== filterEvent) return false
    return true
  })

  const toggleFeatured = (mediaId: string) => {
    setMedia(prev => prev.map(item => 
      item.id === mediaId ? { ...item, isFeatured: !item.isFeatured } : item
    ))
  }

  const stats = {
    total: media.length,
    videos: media.filter(m => m.type === "video").length,
    images: media.filter(m => m.type === "image").length,
    featured: media.filter(m => m.isFeatured).length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--secondary)]/10">
                <Grid3X3 className="h-5 w-5 text-[var(--secondary)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Media</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Videos</p>
                <p className="text-2xl font-semibold">{stats.videos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-2xl font-semibold">{stats.images}</p>
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
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-2xl font-semibold">{stats.featured}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Gallery */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Media Gallery</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterEvent} onValueChange={(v) => setFilterEvent(v as typeof filterEvent)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="audition">Audition</SelectItem>
                  <SelectItem value="guest_performance">Guest Performance</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Media</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Or add from URL
                    </div>
                    <div className="space-y-2">
                      <Label>Media URL (YouTube, Vimeo, or direct link)</Label>
                      <Input placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input placeholder="Enter title" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Enter description" />
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
                          <SelectItem value="guest_performance">Guest Performance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsUploadOpen(false)}>
                        Upload
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedia.map((item) => (
                <div key={item.id} className="group relative rounded-lg overflow-hidden border bg-muted/30">
                  <div className="aspect-video relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="h-6 w-6 text-primary fill-current ml-1" />
                        </div>
                      </div>
                    )}
                    {item.isFeatured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-amber-500 text-white border-amber-500">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={eventTypeColors[item.eventType]} variant="outline">
                        {eventTypeLabels[item.eventType]}
                      </Badge>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setPreviewMedia(item)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleFeatured(item.id)}
                      >
                        {item.isFeatured ? (
                          <StarOff className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="w-24 h-16 rounded overflow-hidden flex-shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-4 w-4 text-white fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      {item.isFeatured && (
                        <Star className="h-4 w-4 text-amber-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <Badge className={eventTypeColors[item.eventType]} variant="outline">
                    {eventTypeLabels[item.eventType]}
                  </Badge>
                  <Badge variant="outline">
                    {item.type === "video" ? <Video className="h-3 w-3 mr-1" /> : <ImageIcon className="h-3 w-3 mr-1" />}
                    {item.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setPreviewMedia(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleFeatured(item.id)}>
                      {item.isFeatured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewMedia} onOpenChange={() => setPreviewMedia(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewMedia?.title}</DialogTitle>
          </DialogHeader>
          {previewMedia && (
            <div className="space-y-4">
              {previewMedia.type === "video" ? (
                <div className="aspect-video">
                  <iframe
                    src={previewMedia.url}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewMedia.url}
                  alt={previewMedia.title}
                  className="w-full rounded-lg"
                />
              )}
              <div>
                <p className="text-muted-foreground">{previewMedia.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={eventTypeColors[previewMedia.eventType]} variant="outline">
                    {eventTypeLabels[previewMedia.eventType]}
                  </Badge>
                  {previewMedia.isFeatured && (
                    <Badge className="bg-amber-500 text-white border-amber-500">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
