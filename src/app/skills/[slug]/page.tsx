'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Terminal,
  Shield,
  Zap,
  Github,
  PlayCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TestDriveModal } from '@/components/dashboard/TestDriveModal'

interface Skill {
  id: number
  name: string
  slug: string
  description: string
  category: string
  author: string
  github_url: string
  install_command: string
  featured?: boolean
  popular?: boolean
  tags?: string[]
}

export default function SkillDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTestDrive, setShowTestDrive] = useState(false)

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await fetch('/skills.json')
        const data = await response.json()
        const foundSkill = data.skills.find((s: Skill) => s.slug === slug)
        setSkill(foundSkill || null)
      } catch (error) {
        console.error('Error fetching skill:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchSkill()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-void">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stellar"></div>
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 bg-void">
        <h2 className="text-2xl font-bold text-white">Skill not found</h2>
        <p className="text-slate-400">The skill you are looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard?menu=agents" className="text-stellar hover:text-stellar/80 transition-colors">Return to Jerril</Link>
      </div>
    )
  }

  const copyCommand = async () => {
    await navigator.clipboard.writeText(skill.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 px-6 py-8 bg-void min-h-screen">

      {/* Test Drive Modal */}
      {showTestDrive && (
        <TestDriveModal skill={skill} onClose={() => setShowTestDrive(false)} />
      )}

      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 text-sm text-slate-400 hover:text-stellar transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <Link href="/dashboard?menu=agents" className="font-medium">Back to Jerril Hub</Link>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 md:items-start justify-between glass-panel p-8 rounded-3xl stellar-border shadow-2xl">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-stellar/10 border border-stellar/20 text-stellar shadow-lg">
              <Terminal className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">{skill.name}</h1>
              <div className="flex items-center gap-3 text-slate-300 text-base mt-2">
                <span className="font-medium">by {skill.author}</span>
                <span className="text-slate-500">•</span>
                <span className="px-3 py-1 rounded-full bg-stellar/10 border border-stellar/20 text-stellar text-sm font-semibold">
                  {skill.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Test Drive Button */}
          <button
            onClick={() => setShowTestDrive(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-stellar to-stellar/80 hover:from-stellar/90 hover:to-stellar text-white transition-all duration-300 shadow-lg shadow-stellar/30 hover:shadow-xl hover:-translate-y-0.5 font-semibold"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Test Drive</span>
          </button>
          <a
            href={skill.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-void border border-white/10 text-white hover:bg-white/5 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Github className="w-5 h-5" />
            <span className="font-semibold">View Source</span>
          </a>
        </div>
      </div>

      {/* Install Block */}
      <div className="rounded-2xl border border-white/10 bg-void/50 backdrop-blur-xl overflow-hidden shadow-2xl stellar-border">
        <div className="flex items-center justify-between px-6 py-4 bg-stellar/5 border-b border-white/10">
          <div className="flex items-center gap-3 text-sm font-mono text-slate-300">
            <Terminal className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider text-stellar">Installation</span>
          </div>
          <button
            onClick={copyCommand}
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-stellar transition-colors px-3 py-1 rounded-lg hover:bg-stellar/10"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </button>
        </div>
        <div className="p-8 font-mono text-base md:text-lg relative group">
          <div className="absolute inset-0 bg-stellar/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-b-2xl" />
          <div className="flex items-center gap-4 text-white relative z-10">
            <span className="text-stellar select-none font-bold">$</span>
            <span className="break-all font-medium">{skill.install_command}</span>
          </div>
        </div>
      </div>

      {/* Description & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <section className="glass-panel p-8 rounded-2xl stellar-border shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6">About this Skill</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
              {skill.description}
            </p>
          </section>

          {/* Features / Capabilities */}
          <section className="glass-panel p-8 rounded-2xl stellar-border shadow-2xl">
             <h3 className="text-2xl font-black text-white mb-6">Capabilities</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex items-start gap-4 text-slate-300">
                 <div className="p-2 rounded-lg bg-stellar/10 border border-stellar/20 mt-1">
                   <Zap className="w-5 h-5 text-stellar" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-white mb-1">Optimized Performance</h4>
                   <span>Engineered for low-latency execution environments.</span>
                 </div>
               </div>
               <div className="flex items-start gap-4 text-slate-300">
                 <div className="p-2 rounded-lg bg-void border border-white/10 mt-1">
                   <Shield className="w-5 h-5 text-slate-300" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-white mb-1">Secure Execution</h4>
                   <span>Sandboxed environment with strict permission boundaries.</span>
                 </div>
               </div>
             </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="p-6 rounded-2xl stellar-border glass-panel shadow-2xl">
            <h4 className="font-black text-white mb-6 text-lg">Metadata</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400 font-medium">Version</span>
                <span className="text-white font-semibold">1.0.0</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400 font-medium">License</span>
                <span className="text-white font-semibold">MIT</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-slate-400 font-medium">Updated</span>
                <span className="text-white font-semibold">2 days ago</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-400 font-medium">Downloads</span>
                <span className="text-white font-semibold">1.2k</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl stellar-border glass-panel shadow-2xl">
            <h4 className="font-black text-white mb-6 text-lg">Tags</h4>
            <div className="flex flex-wrap gap-3">
              {(skill.tags || ['ai', 'automation']).map((tag: string) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-void border border-white/10 text-slate-300 text-sm font-medium hover:bg-stellar/10 hover:text-stellar transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}