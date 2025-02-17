import { useState } from 'react'
import {Link} from 'react-router-dom'
import { auth } from "../TradingBots/firebase"
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Login ()
{
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState( '' )
    const handleSubmit = async ( e ) =>
    {
        e.preventDefault()
        try
        {
           await signInWithEmailAndPassword( auth, email, password ) 
            console.log('Login succesfully')
        }
        catch ( err )
        {
            console.log(err)
        }
    }
   
  return (
      <div>
          <form onSubmit={handleSubmit}>
              <p>Login</p>
              <label htmlFor='email'>
                  Email:
                  <input type='text' onChange={ ( e ) => setEmail( e.target.value ) } />
              </label>
              <label htmlFor='password'>
                  Password:
                  <input type='password' onChange={ ( e ) => setPassword( e.target.value ) } />
              </label>
              <button type='submit'>Login</button>
              <p>Dont have an account? <Link to="/signup"></Link></p>

          </form>
      
    </div>
  )
}
