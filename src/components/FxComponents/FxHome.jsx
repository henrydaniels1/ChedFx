import FxLanding from "./FxLanding"
import FxNav from './FxSidebar'
import '../../App.css'
import '../../style/Fxstyle.css'
import { Faq } from './Faq'
import { Footer } from '../Footer.jsx'
import Contact from '../Contact.jsx'
import Pricing from "./Card2.jsx"
import ExampleComponent from '../../example/Scroll'

// import App from './Fxparallax.jsx'
// import GettingS from "./FxComponents/GettingS"
// import AboutFx from './AboutFx'



export default function FxHome() {
    return (
      <div className="stylish-regular overflow-hidden">
     
       
        <div className='mx-auto w-[97%] lg:w-[95%]'>
        <FxNav/>
        </div>
        
        <div className=" space-y-16">
         
          <FxLanding />  <ExampleComponent/>
          {/* <AboutFx /> */}
          <Pricing/>
          <Faq />
          <Contact/>
          <Footer/>
       
            
         {/* <App/> */}
        </div>

        
      </div>
  )
}
