'use client'

import { Layout, Activity } from 'lucide-react'

export function SettingsView() {
  return (
    <div className="p-8 h-full overflow-y-auto bg-void">
      <h2 className="text-2xl font-black tracking-tight text-white mb-6">Settings</h2>

      <div className="space-y-6 max-w-2xl">
        {/* Account Settings */}
        <div className="glass-panel p-6 rounded-2xl stellar-border shadow-2xl">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-full bg-stellar/10 border border-stellar/20 flex items-center justify-center">
              <Layout className="w-4 h-4 text-stellar" />
            </div>
            Account Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <div>
                <p className="font-medium text-sm text-slate-300">Email Notification</p>
                <p className="text-xs text-slate-500">Receive daily market summaries</p>
              </div>
              <div className="w-12 h-6 bg-white/20 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-stellar rounded-full absolute top-1 left-1" />
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-medium text-sm text-slate-300">Dark Mode</p>
                <p className="text-xs text-slate-500">Toggle application theme</p>
              </div>
              <div className="w-12 h-6 bg-stellar rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-void rounded-full absolute top-1 right-1" />
              </div>
            </div>
          </div>
        </div>

        {/* API & Data Settings */}
        <div className="glass-panel p-6 rounded-2xl stellar-border shadow-2xl">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-full bg-stellar/10 border border-stellar/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-stellar" />
            </div>
            Data Sources
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-void/50 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-stellar rounded-full animate-pulse" />
                <span className="text-sm font-bold text-white">Yahoo Finance API</span>
              </div>
              <span className="text-xs font-bold text-stellar bg-stellar/10 px-2 py-1 rounded">CONNECTED</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-void/50 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-stellar rounded-full animate-pulse" />
                <span className="text-sm font-bold text-white">OpenRouter AI</span>
              </div>
              <span className="text-xs font-bold text-stellar bg-stellar/10 px-2 py-1 rounded">OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="glass-panel p-6 rounded-2xl stellar-border shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-stellar/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <h3 className="font-bold text-lg mb-2 relative z-10 text-white">Pro Plan</h3>
          <p className="text-slate-400 text-sm mb-6 relative z-10">Your subscription is active until Dec 2026.</p>
          <button className="w-full py-3 bg-stellar text-void font-bold rounded-xl text-sm hover:bg-stellar/90 transition-colors relative z-10">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  )
}