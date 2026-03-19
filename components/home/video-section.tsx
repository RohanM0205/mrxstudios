'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Play, X, Volume2, VolumeX, Maximize2, Pause } from 'lucide-react'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black
//  Surface   #1a0d2e   rich plum
//  Marigold  #f5a623   warm saffron (primary gold)
//  Ember     #ff6b35   burnished orange (accent)
//  Crimson   #e8175d   celebration red (CTA)
// ─────────────────────────────────────────────────────────────────────────────

// ── HOW TO ADD YOUR CLOUDINARY VIDEOS ────────────────────────────────────────
// 1. Upload your video to Cloudinary
// 2. Copy the video URL  e.g. https://res.cloudinary.com/YOUR_CLOUD/video/upload/v.../your-video.mp4
// 3. Paste it in the `videoUrl` field below
// 4. Add a thumbnail URL in `thumbnail` (can be a Cloudinary image or Unsplash)
// ─────────────────────────────────────────────────────────────────────────────

interface Video {
  id: string
  title: string
  subtitle: string
  thumbnail: string
  videoUrl: string        // ← paste your Cloudinary URL here
  category: string
  categoryColor: string
  duration: string
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Wedding Sangeet',
    subtitle: 'Sharma & Mehta Family',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    videoUrl: 'https://res.cloudinary.com/dmjds6upr/video/upload/v1773949260/Ranjhana_Dance_Performance_Original_Video_Best_Sangeet_Performance_Ever_1080P_z2qvwh.mp4',
    category: 'Wedding',
    categoryColor: '#f5a623',
    duration: '2:34',
  },
  {
    id: '2',
    title: 'Corporate Annual Day',
    subtitle: 'TCS Pune 2024',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    videoUrl: 'https://res.cloudinary.com/dmjds6upr/video/upload/v1773951437/Corp1_amlgtm.mp4',
    category: 'Corporate',
    categoryColor: '#ff6b35',
    duration: '3:12',
  },
  {
    id: '3',
    title: 'College Fest Flash Mob',
    subtitle: 'COEP Pune — 800 Students',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    videoUrl: 'https://res.cloudinary.com/dmjds6upr/video/upload/v1773951561/college_dh3gii.mp4',
    category: 'College',
    categoryColor: '#e8175d',
    duration: '1:58',
  },
]

// ── MODAL PLAYER ─────────────────────────────────────────────────────────────
function VideoModal({
  video,
  onClose,
}: {
  video: Video
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // Auto-play when modal opens
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().then(() => setPlaying(true)).catch(() => {})
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else { v.play(); setPlaying(true) }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !muted
    setMuted(!muted)
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    setCurrentTime(v.currentTime)
    setProgress((v.currentTime / v.duration) * 100)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    v.currentTime = pct * v.duration
  }

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen?.()
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,4,15,0.96)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 flex items-center justify-center rounded-full z-10 transition-all duration-200"
        style={{
          width: 44, height: 44,
          background: 'rgba(245,166,35,0.12)',
          border: '1px solid rgba(245,166,35,0.3)',
          color: 'rgba(255,255,255,0.8)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(232,23,93,0.25)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(232,23,93,0.6)'
          ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,166,35,0.12)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,166,35,0.3)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)'
        }}
      >
        <X size={18} />
      </button>

      {/* Player wrapper */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          maxWidth: 900,
          background: '#0d0a1a',
          border: '1px solid rgba(245,166,35,0.2)',
          boxShadow: '0 0 80px rgba(245,166,35,0.12), 0 40px 80px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gold top-line accent */}
        <div
          className="absolute top-0 left-0 right-0 z-10"
          style={{
            height: 2,
            background: 'linear-gradient(90deg, #f5a623, #ff6b35, #e8175d)',
          }}
        />

        {/* Video element */}
        <div className="relative" style={{ aspectRatio: '16/9' }}>
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              setDuration(videoRef.current?.duration ?? 0)
              setLoaded(true)
            }}
            onEnded={() => setPlaying(false)}
            playsInline
          />

          {/* Click overlay to toggle play */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={togglePlay}
          >
            {/* Centre play/pause indicator — fades in briefly on toggle */}
            {!playing && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(13,10,26,0.45)' }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 72, height: 72,
                    background: 'linear-gradient(135deg, #f5a623, #ff6b35)',
                    boxShadow: '0 0 40px rgba(245,166,35,0.6)',
                  }}
                >
                  <Play size={28} fill="#fff" stroke="none" style={{ marginLeft: 4 }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CUSTOM CONTROLS BAR ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(26,13,46,0.95), rgba(13,10,26,0.98))',
            padding: '12px 20px 16px',
          }}
        >
          {/* Progress bar */}
          <div
            className="relative w-full rounded-full cursor-pointer mb-3"
            style={{ height: 4, background: 'rgba(255,255,255,0.1)' }}
            onClick={handleSeek}
          >
            {/* Filled track */}
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f5a623, #ff6b35, #e8175d)',
              }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${progress}%`,
                transform: `translateX(-50%)`,
                width: 12, height: 12,
                background: '#f5a623',
                boxShadow: '0 0 8px rgba(245,166,35,0.8)',
                transition: 'left 0.1s linear',
              }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="flex items-center justify-center rounded-full transition-all duration-150"
                style={{
                  width: 36, height: 36,
                  background: 'rgba(245,166,35,0.15)',
                  border: '1px solid rgba(245,166,35,0.3)',
                  color: '#f5a623',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,166,35,0.28)')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,166,35,0.15)')}
              >
                {playing
                  ? <Pause size={14} fill="#f5a623" stroke="none" />
                  : <Play size={14} fill="#f5a623" stroke="none" style={{ marginLeft: 2 }} />
                }
              </button>

              {/* Mute */}
              <button
                onClick={toggleMute}
                className="flex items-center justify-center rounded-full transition-all duration-150"
                style={{
                  width: 36, height: 36,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)')}
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              {/* Time */}
              <span
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12, fontWeight: 500,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {formatTime(currentTime)}
                <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 4px' }}>/</span>
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Title */}
              <span
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 15, fontWeight: 700,
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                {video.title}
              </span>
              {/* Category badge */}
              <span
                className="rounded-full px-3 py-0.5"
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  background: `${video.categoryColor}22`,
                  border: `1px solid ${video.categoryColor}55`,
                  color: video.categoryColor,
                }}
              >
                {video.category}
              </span>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="flex items-center justify-center rounded-full transition-all duration-150"
                style={{
                  width: 36, height: 36,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#f5a623')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)')}
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MAIN SECTION ─────────────────────────────────────────────────────────────
export function VideoSection() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d0a1a 0%, #110820 50%, #0d0a1a 100%)' }}
    >
      {/* ── AMBIENT BACKGROUND GLOW ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            top: '10%', left: '-10%',
            background: 'radial-gradient(circle, #f5a623 0%, transparent 70%)',
            opacity: 0.05, filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: '5%', right: '-8%',
            background: 'radial-gradient(circle, #e8175d 0%, transparent 70%)',
            opacity: 0.06, filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* ── SECTION HEADER ── */}
        <div className="text-center mb-16">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-5">
            <div
              className="rounded-full"
              style={{ width: 6, height: 6, background: '#f5a623', boxShadow: '0 0 8px rgba(245,166,35,0.8)' }}
            />
            <span
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#f5a623',
              }}
            >
              Our Work
            </span>
            <div
              className="rounded-full"
              style={{ width: 6, height: 6, background: '#e8175d', boxShadow: '0 0 8px rgba(232,23,93,0.8)' }}
            />
          </div>

          <h2
            style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: 'clamp(36px, 6vw, 62px)',
              fontWeight: 900, lineHeight: 1.1,
              color: '#fff',
              marginBottom: 16,
              letterSpacing: '-0.01em',
            }}
          >
            Performances That{' '}
            <span
              style={{
                background: 'linear-gradient(110deg, #f5a623 0%, #ff6b35 50%, #e8175d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.35))',
              }}
            >
              Speak Louder
            </span>
          </h2>

          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 'clamp(15px, 2vw, 17px)',
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 520, margin: '0 auto',
              lineHeight: 1.75,
            }}
          >
            Watch some of our most memorable performances and get inspired for your event.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(245,166,35,0.4))' }} />
            <div style={{ width: 6, height: 6, background: '#f5a623', transform: 'rotate(45deg)', borderRadius: 1 }} />
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(245,166,35,0.4))' }} />
          </div>
        </div>

        {/* ── VIDEO GRID ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative text-left rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '16/9',
                border: `1px solid ${hoveredId === video.id ? `${video.categoryColor}55` : 'rgba(255,255,255,0.07)'}`,
                boxShadow: hoveredId === video.id
                  ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${video.categoryColor}22`
                  : '0 8px 24px rgba(0,0,0,0.3)',
                transform: hoveredId === video.id ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Thumbnail */}
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
                style={{
                  transform: hoveredId === video.id ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
                }}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(13,10,26,0.92) 0%, rgba(13,10,26,0.4) 50%, rgba(13,10,26,${hoveredId === video.id ? '0.15' : '0.25'}) 100%)`,
                  transition: 'background 0.3s ease',
                }}
              />

              {/* Category + duration top row */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span
                  className="rounded-full px-3 py-1"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: `${video.categoryColor}22`,
                    border: `1px solid ${video.categoryColor}55`,
                    color: video.categoryColor,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {video.category}
                </span>
                <span
                  className="rounded-full px-2.5 py-1"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 10, fontWeight: 600,
                    background: 'rgba(13,10,26,0.7)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {video.duration}
                </span>
              </div>

              {/* Centre play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: hoveredId === video.id ? 68 : 58,
                    height: hoveredId === video.id ? 68 : 58,
                    background: hoveredId === video.id
                      ? `linear-gradient(135deg, ${video.categoryColor}, #ff6b35)`
                      : 'rgba(255,255,255,0.15)',
                    border: hoveredId === video.id
                      ? 'none'
                      : '2px solid rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: hoveredId === video.id
                      ? `0 0 30px ${video.categoryColor}80, 0 8px 20px rgba(0,0,0,0.4)`
                      : 'none',
                    transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                  }}
                >
                  <Play
                    size={hoveredId === video.id ? 22 : 20}
                    fill="#fff"
                    stroke="none"
                    style={{ marginLeft: 3, transition: 'all 0.2s ease' }}
                  />
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 18, fontWeight: 700,
                    color: '#fff',
                    marginBottom: 2,
                    textShadow: '0 1px 8px rgba(0,0,0,0.6)',
                  }}
                >
                  {video.title}
                </h3>
                <p
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 12, fontWeight: 400,
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {video.subtitle}
                </p>

                {/* Marigold underline — slides in on hover */}
                <div
                  style={{
                    height: 2, borderRadius: 999, marginTop: 8,
                    background: `linear-gradient(90deg, ${video.categoryColor}, transparent)`,
                    width: hoveredId === video.id ? '60%' : '0%',
                    transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* ── VIEW ALL CTA ── */}
        <div className="text-center">
          <a
            href="/portfolio"
            className="inline-flex items-center gap-3 rounded-2xl px-8 py-4"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, rgba(245,166,35,0.12), rgba(232,23,93,0.1))',
              border: '1px solid rgba(245,166,35,0.3)',
              color: '#f5a623',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'linear-gradient(135deg, rgba(245,166,35,0.22), rgba(232,23,93,0.18))'
              el.style.borderColor = 'rgba(245,166,35,0.55)'
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 8px 30px rgba(245,166,35,0.18)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'linear-gradient(135deg, rgba(245,166,35,0.12), rgba(232,23,93,0.1))'
              el.style.borderColor = 'rgba(245,166,35,0.3)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            View Full Portfolio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── VIDEO MODAL ── */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* ── FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  )
}