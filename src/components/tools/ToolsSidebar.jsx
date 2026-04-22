import PropTypes from 'prop-types'
import { Calculator, List, Percent, FileText, DollarSign, ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export const tools = [
  { name: 'Currency Converter', desc: 'Convert between currencies live', icon: Calculator, component: 'CurrencyConverter' },
  { name: 'Pip Converter', desc: 'Pip value in USD', icon: DollarSign, component: 'PipConverter' },
  { name: 'Trading Checklist', desc: 'Pre-trade criteria tracker', icon: List, component: 'TradingChecklist' },
  { name: 'Position Calculator', desc: 'Lot size & P&L calculator', icon: Percent, component: 'PositionCalculator' },
  { name: 'Notes', desc: 'Quick trading notes', icon: FileText, component: 'Notes' },
]

export function ToolsSidebar({ onToolSelect, selectedTool, collapsed, onToggleCollapse }) {
  return (
    <div className={`relative flex flex-col h-[100dvh] bg-[#0d1117] border-r border-gray-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>

      {/* Header */}
      <div className={`flex items-center border-b border-gray-800 h-16 px-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}>
              Ched<span className="text-[#ecae10]">Fx</span>
            </span>
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors hidden md:flex">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Tools list */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
        {!collapsed && (
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-2 mb-3">Tools</p>
        )}
        {tools.map((tool) => {
          const active = selectedTool === tool.component
          return (
            <button
              key={tool.component}
              onClick={() => onToolSelect(tool.component)}
              title={collapsed ? tool.name : undefined}
              className={`w-full flex items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-all duration-150 group
                ${active
                  ? 'bg-[#ecae10]/10 text-[#ecae10] border border-[#ecae10]/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent'
                }`}>
              <tool.icon size={18} className={`shrink-0 ${active ? 'text-[#ecae10]' : 'text-gray-500 group-hover:text-white'}`} />
              {!collapsed && (
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${active ? 'text-[#ecae10]' : ''}`}>{tool.name}</p>
                  <p className="text-xs text-gray-500 truncate">{tool.desc}</p>
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-2">
        <Link
          to="/"
          className={`flex items-center gap-3 rounded-lg px-2 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Home' : undefined}>
          <Home size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm">Back to Home</span>}
        </Link>
      </div>
    </div>
  )
}

ToolsSidebar.propTypes = {
  onToolSelect: PropTypes.func.isRequired,
  selectedTool: PropTypes.string,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func.isRequired,
}
