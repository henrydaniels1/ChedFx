import '../../App.css'
import '../../style/Fxstyle.css'
import Forex from './CurrencyConverter'
import ExampleComponent from '../../example/Scroll'
import PipConverter from './PipConv'
import ForexTradingChecklist2 from './Todo2'
import PositionSizeCalculator from './PositionLot'


// g3pc1zQlrr77GiH

export default function MainBot() {
  return (
    <div className="stylish-regular  ">
      <ExampleComponent />
      <div className="space-y-16 px-2 overflow-hidden py-8 mx-auto lg:w-[50%] w-[97%]">
         <ForexTradingChecklist2/>
        <Forex />
        <PipConverter/>
        <PositionSizeCalculator />  
      </div>
    </div>
  )
}
