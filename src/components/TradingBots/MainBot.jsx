import { useState } from 'react'
import { ForexSidebar } from './ForexSidebar'
import Forex from './CurrencyConverter'
import PipConverter from './PipConv'
import ForexTradingChecklist2 from './Todo2'
import PositionSizeCalculator from './PositionLot'
// import ForexPercentageCalculator from './PercentCalc'
import NoteApp from './Notes'
import { Menu, X } from 'lucide-react'

export default function MainBot() {
  const [selectedTool, setSelectedTool] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleToolSelect = (tool) => {
    setSelectedTool(tool)
    setIsSidebarOpen(false)
  }

  const handleMainClick = () => {
    if (isSidebarOpen) setIsSidebarOpen(false)
  }

  const renderTool = () => {
    switch (selectedTool) {
      case 'Forex':
        return <Forex />
      case 'PipConverter':
        return <PipConverter />
      case 'ForexTradingChecklist2':
        return <ForexTradingChecklist2 />
      case 'PositionSizeCalculator':
        return <PositionSizeCalculator />
      // case 'ForexPercentageCalculator':
      //   return <ForexPercentageCalculator />
      case 'NoteApp':
        return <NoteApp />
      default:
        return (
          <div className='flex items-center justify-center h-full text-white text-2xl'>
            Select a tool from the sidebar
          </div>
        )
    }
  }

  return (
    <div className=''>
      <div
        className="stylish-regular bg-[url('./assets/Back4.svg')] bg-no-repeat bg-center bg-cover  bg-opacity-20  flex h-[100svh]"
        onClick={handleMainClick}>
        <div
          className={`fixed md:relative z-40 transition-transform duration-300 ${
            isSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'
          } md:flex bg-yellow-900 backdrop-blur-lg shadow-lg w-64 `}
          onClick={(e) => e.stopPropagation()}>
          <ForexSidebar onToolSelect={handleToolSelect} />
        </div>

        <button
          className='absolute top-4 right-4 z-50  p-2 bg-gray-900  text-white rounded-md md:hidden'
          onClick={(e) => {
            e.stopPropagation()
            toggleSidebar()
          }}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <main className='w-full px-4 pt-20 pb-8 mx-auto overflow-auto'>
          {renderTool()}
        </main>
      </div>
    </div>
  )
}
