import '../../App.css'
import '../../style/Fxstyle.css'
import Forex from './CurrencyConverter'
import ExampleComponent from '../../example/Scroll'
import PipConverter from './PipConv'
import ForexTradingChecklist2 from './Todo2'
import PositionSizeCalculator from './PositionLot'
import ForexPercentageCalculator from './PercentCalc'
import NoteApp from './Notes'
// import NoteForm from './Noteform';
// import NoteList from './NoteList';


// g3pc1zQlrr77GiH

export default function MainBot() {
  return (
    <div className="stylish-regular bg-[url('./assets/Back5.svg')] bg-no-repeat bg-center bg-cover object-fill">
      <ExampleComponent />
      <div className="space-y-16 px-2 overflow-hidden py-8 mx-auto lg:w-[50%] w-[97%]">
        <div>
          {/* <NoteForm />
          <NoteList/> */}
          <NoteApp/>
        </div>
         <ForexTradingChecklist2/>
        <Forex />
        <ForexPercentageCalculator/>
        <PipConverter/>
        <PositionSizeCalculator />  
      </div>
    </div>
  )
}
