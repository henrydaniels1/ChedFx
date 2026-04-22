import { useState } from 'react'
import { ToolsSidebar, tools } from '../components/tools/ToolsSidebar'
import CurrencyConverter from '../components/tools/CurrencyConverter'
import PipConverter from '../components/tools/PipConverter'
import TradingChecklist from '../components/tools/TradingChecklist'
import PositionCalculator from '../components/tools/PositionCalculator'
import Notes from '../components/tools/Notes'
import { Menu, X } from 'lucide-react'

const toolMap = {
  CurrencyConverter,
  PipConverter,
  TradingChecklist,
  PositionCalculator,
  Notes,
}

function EmptyState({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">Get started</p>
      <h2 className="text-white text-2xl font-semibold mb-8">Pick a tool to open</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
        {tools.map((tool) => (
          <button
            key={tool.component}
            onClick={() => onSelect(tool.component)}
            className="flex items-start gap-4 p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-[#ecae10]/50 hover:bg-gray-800 transition-all duration-200 text-left group">
            <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-[#ecae10]/10 transition-colors">
              <tool.icon size={20} className="text-gray-400 group-hover:text-[#ecae10] transition-colors" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">{tool.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{tool.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MainBot() {
  const [selectedTool, setSelectedTool] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleToolSelect = (tool) => {
    setSelectedTool(tool)
    setIsSidebarOpen(false)
  }

  const activeTool = tools.find((t) => t.component === selectedTool)
  const ActiveComponent = selectedTool ? toolMap[selectedTool] : null

  return (
    <div className="flex h-[100dvh] bg-[#080c12] overflow-hidden stylish-regular">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed md:relative z-40 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <ToolsSidebar
          onToolSelect={handleToolSelect}
          selectedTool={selectedTool}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Top bar */}
        <header className="flex items-center gap-4 h-16 px-4 border-b border-gray-800 bg-[#0d1117] shrink-0">
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2 min-w-0">
            {activeTool ? (
              <>
                <div className="p-1.5 rounded-md bg-[#ecae10]/10">
                  <activeTool.icon size={16} className="text-[#ecae10]" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{activeTool.name}</p>
                  <p className="text-gray-500 text-xs truncate hidden sm:block">{activeTool.desc}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No tool selected</p>
            )}
          </div>

          {activeTool && (
            <button
              onClick={() => setSelectedTool(null)}
              className="ml-auto text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-gray-800">
              ← All tools
            </button>
          )}
        </header>

        {/* Tool area */}
        <main className="flex-1 overflow-auto">
          {ActiveComponent ? (
            <div key={selectedTool} className="animate-fadeIn h-full p-4 md:p-6">
              <ActiveComponent />
            </div>
          ) : (
            <EmptyState onSelect={handleToolSelect} />
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  )
}
