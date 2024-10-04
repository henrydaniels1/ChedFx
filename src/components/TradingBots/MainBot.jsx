import CurrencyComparisonTool from './TradeProb'
import PositionSizeCalculator from './PositionLot'
import Forex from './CurrencyConverter'
import CurrencyCorrelationTool from './CurrencyCol'
import '../../App.css'
import '../../style/Fxstyle.css'
// import ForexStrategy from "./Crown"




export default function MainBot() {
  return (
      <div className="space-y-16 px-6 stylish-regular overflow-hidden py-8 mx-auto lg:w-[95%] w-[97%] ">
          
          {/* <ForexStrategy/> */ }
          
          <CurrencyComparisonTool />  
          <PositionSizeCalculator />  
          <Forex />
           <CurrencyCorrelationTool/> 

          {/* <div className='flex justify-between bg-gray-900 w-full md:flex-row flex-col space-y-16'>
              <div className="md:w-1/2 w-full">
                 <CurrencyComparisonTool  />  
              </div>
              <div className="md:w-1/2 w-full">
                 <PositionSizeCalculator   />  
             </div>
         
          </div>
          <div className='flex justify-between w-full bg-gray-900 md:flex-row flex-col space-y-16'>
              <div className="md:w-1/2 w-full">  <Forex /></div>
              <div className="md:w-1/2 w-full"> <CurrencyCorrelationTool/>  </div>
          </div>
         */}
         
      
    </div>
  )
}
