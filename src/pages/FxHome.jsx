import FxLanding from '../components/landing/FxLanding'
import '../App.css'
import '../style/Fxstyle.css'
import { Faq } from '../components/landing/Faq'
import { Footer } from '../components/shared/Footer'
import Contact from '../components/shared/Contact'
import Pricing from '../components/landing/Pricing'
import ExampleComponent from '../example/Scroll'

export default function FxHome() {
  return (
    <div className="stylish-regular overflow-hidden space-y-16">
      <div className="space-y-16">
        <FxLanding />
        <ExampleComponent />
        <Pricing />
        <Faq />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}
