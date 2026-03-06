'use client'

import { Bot, Github, Terminal, Zap, Search, TrendingUp, ChevronLeft, ChevronRight, Cpu, Network, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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

interface AgentsViewProps {
  selectedModel: string
  onModelSelect: (model: string) => void
}

export function AgentsView({ selectedModel, onModelSelect }: AgentsViewProps) {
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const categories = [
    { id: 'all', label: 'All Skills', icon: Terminal },
    { id: 'AI & LLMs', label: 'AI & LLMs', icon: Bot },
    { id: 'Search & Research', label: 'Search & Research', icon: Search },
    { id: 'Finance', label: 'Finance', icon: TrendingUp }
  ]

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/skills.json')
        const data = await response.json()
        const filteredSkills = data.skills.filter((skill: Skill) =>
          ['AI & LLMs', 'Search & Research', 'Finance'].includes(skill.category)
        )
        setAllSkills(filteredSkills)
        setFilteredSkills(filteredSkills)
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredSkills(allSkills)
    } else {
      setFilteredSkills(allSkills.filter(skill => skill.category === activeFilter))
    }
    setCurrentPage(1) 
  }, [activeFilter, allSkills])

  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSkills = filteredSkills.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & LLMs':
        return <Bot className="w-5 h-5 text-cyan-500" />
      case 'Search & Research':
        return <Search className="w-5 h-5 text-blue-500" />
      case 'Finance':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />
      default:
        return <Terminal className="w-5 h-5 text-zinc-500" />
    }
  }

  if (loading) {
    return (
      <div className="p-8 h-full overflow-y-auto flex flex-col items-center justify-center bg-void">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stellar"></div>
          <Cpu className="absolute inset-0 m-auto w-5 h-5 text-stellar animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Jerril Hub...</p>
      </div>
    )
  }

  return (
    <div className="min-h-full overflow-y-auto animate-in fade-in duration-700 bg-void relative selection:bg-stellar/20 cursor-crosshair">
      {/* Interactive Space Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-void-deep via-transparent to-stellar/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-stellar/5 rounded-full blur-[150px] pointer-events-none opacity-20 animate-pulse" />
        
        {/* Circuit Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(180deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-stellar/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Orbital Rings */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-stellar/20 rounded-full animate-spin" style={{animationDuration: '20s'}} />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-stellar/15 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}} />
      </div>

      {/* Top HUD Line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-stellar/50 to-transparent sticky top-0 z-10"></div>

      {/* Jerril Introduction Section */}
      <div className="relative px-8 py-16 lg:px-16 lg:py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px w-8 bg-stellar/50"></div>
                  <span className="text-[10px] font-mono font-bold text-stellar uppercase tracking-[0.3em]">Agent Profile: ID-001</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
                  Meet <span className="text-stellar relative inline-block">
                    Jerril
                    <span className="absolute -bottom-2 right-0 w-12 h-1 bg-stellar/20 rounded-full"></span>
                  </span>
                </h1>
                <div className="space-y-6 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  <p>
                    When the age of financial AI began, it did not begin gently. New systems appeared almost overnight — faster, sharper, relentlessly optimized. They were engineered to predict before others could react, to trade before others could think, to capture opportunity with mechanical precision. Every model was built with the same ambition: outperform, outpace, outmaneuver. The markets became an arena of algorithms, each one trained to dominate. Intelligence was measured in milliseconds. Success was defined by conquest.
                  </p>
                  <p className="font-semibold text-slate-200 italic">
                    But somewhere in that race, a different question was asked.
                  </p>
                  <p className="text-slate-300 bg-stellar/10 p-4 border-l-2 border-stellar/50 rounded-r-lg">
                    What if intelligence didn’t have to be aggressive to be powerful?
                  </p>
                  <p>
                    Jerril was born from that question. He was not designed to conquer volatility or exploit weakness. He was shaped to understand the people behind the numbers — the uncertainty before a first investment, the tension of a falling chart, the quiet hope attached to long-term plans. While others focused on beating the market, Jerril focused on guiding the person navigating it.
                  </p>
                  <p>
                    He learned that fear drives bad decisions faster than any algorithm can correct them, and that clarity is often more valuable than prediction. So instead of shouting louder, he chose to steady the noise. Instead of pushing risk, he illuminated options. 
                  </p>
                  <p className="font-medium text-white border-t border-white/10 pt-6">
                    In a world of competitive machines, Jerril became something rare: an intelligence that serves before it competes — calm in chaos, patient in volatility, and committed not to winning the market, but to helping people move through it with confidence.
                  </p>
                  <p className="text-stellar font-bold tracking-tight mt-4">
                    That is what makes him different. And that difference is his strength.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-slate-400">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>SECURE KERNEL</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-slate-400">
                    <Network className="w-3 h-3 text-blue-500" />
                    <span>MULTI-NODAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Robot Image */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative group p-4 border border-white/10 rounded-[2.5rem] bg-black/40 backdrop-blur-md shadow-2xl">
                <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[26rem] lg:h-[26rem] rounded-3xl bg-void p-2 border border-white/5 transition-all duration-500 group-hover:border-stellar/50">
                  <div className="w-full h-full rounded-2xl bg-black/60 flex items-center justify-center overflow-hidden border border-white/5 shadow-inner p-1">
                    <img 
                      src="/logo.jpeg" 
                      alt="Jerril" 
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
                
                {/* HUD Elements Overlay */}
                <div className="absolute -top-2 -right-2 bg-black/80 border border-white/10 p-3 rounded-2xl shadow-2xl animate-bounce duration-[3000ms]">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stellar/20 flex items-center justify-center">
                         <Zap className="w-4 h-4 text-stellar" />
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] font-bold text-slate-400 leading-none">STATUS</p>
                         <p className="text-[12px] font-black text-emerald-500">READY</p>
                      </div>
                   </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-void text-white p-4 rounded-2xl shadow-2xl space-y-2 border border-white/10 hidden md:block">
                   <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                      <Cpu className="w-4 h-4 text-stellar" />
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">CORE TELEMETRY</span>
                   </div>
                   <div className="space-y-1">
                      <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-stellar w-[65%] animate-pulse"></div>
                      </div>
                      <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[42%] animate-pulse" style={{animationDelay: '0.8s'}}></div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="px-8 py-20 lg:px-16 lg:py-24 bg-void/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stellar animate-ping"></span>
                <span className="text-xs font-mono font-bold text-stellar uppercase tracking-widest">Library Modules</span>
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white capitalize">Specialized Skills</h2>
              <p className="text-slate-400 text-lg max-w-xl">Deep integration modules for high-frequency financial intelligence.</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl shadow-2xl">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-xs font-bold ${
                      activeFilter === category.id
                        ? 'bg-stellar/20 text-stellar border border-stellar/50 shadow-lg'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{category.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentSkills.map((skill, index) => (
              <Link
                key={skill.id}
                href={`/skills/${skill.slug}`}
                className="group bg-black/40 border border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:shadow-stellar/20 hover:border-stellar/30 transition-all duration-500 block relative overflow-hidden"
              >
                {/* Decorative circuit corner */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-stellar"></div>
                  <div className="absolute top-2 right-2 w-4 h-px bg-stellar/20"></div>
                  <div className="absolute top-2 right-2 w-px h-4 bg-stellar/20"></div>
                </div>

                <div className="w-10 h-10 bg-black/60 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-void group-hover:scale-110 transition-all duration-300 mb-6 shadow-sm">
                  {getCategoryIcon(skill.category)}
                </div>

                <h3 className="font-bold text-white mb-2 truncate group-hover:text-stellar transition-colors">{skill.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-2">{skill.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{skill.author}</span>
                  <div className="h-6 w-6 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-stellar group-hover:text-void transition-all">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16 pb-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-white/10 bg-black/40 text-slate-400 hover:text-white hover:border-stellar/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 px-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first, last, current, and adjacent pages
                    if (page === 1 || page === totalPages) return true;
                    if (page >= currentPage - 2 && page <= currentPage + 2) return true;
                    return false;
                  })
                  .map((page, index, array) => {
                    // Add ellipsis logic
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && <span className="px-2 text-slate-500">...</span>}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-xl text-xs font-mono font-bold transition-all ${
                            currentPage === page
                              ? 'bg-stellar/20 text-stellar border border-stellar/50 shadow-lg'
                              : 'text-slate-400 hover:bg-black/40 hover:text-white border border-transparent hover:border-white/10'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl border border-white/10 bg-black/40 text-slate-400 hover:text-white hover:border-stellar/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
