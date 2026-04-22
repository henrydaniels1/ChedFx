import FxHeader from './FxHeader'
import FxNav from './FxNav'

export default function FxLanding() {
  return (
    <div>
      <div className='mx-auto w-[97%] lg:w-[95%]'>
        <FxNav />
      </div>
      <FxHeader />
    </div>
  )
}
