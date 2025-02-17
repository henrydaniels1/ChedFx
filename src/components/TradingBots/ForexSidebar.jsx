import { Calculator, List, Percent, CreditCard, FileText } from 'lucide-react'

const tools = [
  { name: 'Currency Converter', icon: Calculator, component: 'Forex' },
  { name: 'Pip Converter', icon: CreditCard, component: 'PipConverter' },
  {
    name: 'Trading Checklist',
    icon: List,
    component: 'ForexTradingChecklist2',
  },
  {
    name: 'Position Size Calculator',
    icon: Percent,
    component: 'PositionSizeCalculator',
  },
//   {
//     name: 'Percentage Calculator',
//     icon: Percent,
//     component: 'ForexPercentageCalculator',
  //   },

  { name: 'Notes', icon: FileText, component: 'NoteApp' },
]

// eslint-disable-next-line react/prop-types
export function ForexSidebar({ onToolSelect }) {
  return (
    <div className='w-64 bg-gray-900 text-white h-[100dvh] flex flex-col'>
      <div className='p-4 border-b border-gray-700'>
        <h2 className='text-lg font-semibold'>Forex Tools</h2>
      </div>
      <div className='flex-1 overflow-y-auto'>
        <ul>
          {tools.map((tool) => (
            <li key={tool.name} className='border-b border-gray-700'>
              <button
                onClick={() => onToolSelect(tool.component)}
                className='flex items-center w-full p-3 hover:bg-gray-800'>
                <tool.icon className='mr-2 h-4 w-4' />
                <span>{tool.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
