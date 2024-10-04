import FxLanding from "./FxLanding"

import '../../App.css'
import '../../style/Fxstyle.css'
import { Faq } from './Faq'
import { Footer } from '../Footer.jsx'
import Contact from '../Contact.jsx'
import Pricing from "./Card2.jsx"
import ExampleComponent from '../../example/Scroll'
// import MainBot from "../TradingBots/MainBot.jsx"

// import TickSubscriber from '../TradingBots/Bot.jsx'

// import App from './Fxparallax.jsx'
// import GettingS from "./FxComponents/GettingS"
// import AboutFx from './AboutFx'



export default function FxHome() {
    return (
      <div className="stylish-regular overflow-hidden space-y-16">
     
       
       
        
        <div className=" space-y-16">
         
          <FxLanding />
          <ExampleComponent />
          {/* <TickSubscriber /> */ }
          {/* <MainBot/> */}
        
        
          <Pricing/>
          <Faq />
          <Contact/>
          <Footer/>
       
        {/* <AboutFx /> */}
         {/* <App/> */}
        </div>

        
      </div>
  )
}
