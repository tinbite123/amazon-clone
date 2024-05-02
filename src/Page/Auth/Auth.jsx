import React, { useState, useContext } from 'react'
import classes from './SignUp.module.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { auth } from "../../Utility/firebase"
import { ClipLoader} from 'react-spinners'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth' 
import {DataContext} from '../../Components/DataProvider/DataProvider'
import { Type } from '../../Utility/action.type'

function Auth() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState({
    signin: false,
    signup: false, 
  })

  const [{user}, dispatch] = useContext(DataContext)
  const navigate = useNavigate();
  const navStateData = useLocation();

  // console.log(user);

  const authHandler = async (e) => {
    e.preventDefault()
    console.log(e.target.name);
    if (e.target.name == "signin"){
      // firebase auth
      setLoading({ ...loading, signIn:true });
      signInWithEmailAndPassword(auth, email, password)
      .then((userInfo)=>{
        dispatch ({
          type:Type.SET_USER,
          user:userInfo.user
        });
      setLoading({...loading, signIn:false})
      navigate(navStateData?.state?.redirect || "/")
      })
      .catch((err)=>{
        setError(err.message);
      setLoading({ ...loading, signIn:false }) 
      })
    }else {
      setLoading({ ...loading, signUp:true })
      createUserWithEmailAndPassword(auth,email,password)
      .then((userInfo)=>{
        dispatch ({
          type:Type.SET_USER,
          user:userInfo.user,
        })
        setLoading({...loading, signUp:false });
        navigate(navStateData?.state?.redirect || "/")
      })
      .catch((err)=>{
        setError(err.message);
        setLoading({...loading, signUp:false })

      })
      
    }
  };

  // console.log(password, email);
  return (
      <section className={classes.logIn}>

    {/* logo */}
    <Link to="/">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" 
      alt="" 
    />

    </Link>

    {/* from */}

    <div className={classes.login__container}>
        <h1>Sign In</h1>
          {navStateData?.state?.message && (
            <small
              style={{
                padding: "5px",
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
              }}
            >
              {navStateData?.state?.message}
            </small>
          )}

        <form action="">

          <label htmlFor="email">Email</label>
          <input onChange={(e)=>setEmail(e.target.value)}
            type="email" 
            id="email"
          />

          <div>
            <label htmlFor="password">Password</label>
            <input 
              value={password} 
              onChange={(p)=>setPassword(p.target.value)} 
              type="password" 
              id="password"
            />
          </div>
          <button 
            type="submit"
            onClick={authHandler}
            name='signin'
            className={classes.login__signInButton}
            >
            {loading.signin ? 
              (<ClipLoader color="#000" size={15}></ClipLoader>
            ) : (
              "Sign in"
            )}
            </button>            
        </form>
      {/* agreement */}
      <p>
      By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & 
      Sale. Please see our Privacy Notice, our Cookies Notice and our 
      Interest-Based Ads Notice.
      </p>

      {/* create account btn */}
      <button 
        type="submit" 
        name='signup'
        onClick={authHandler} 
        className={classes.login__registerButton}
        >
          {loading.signup ? 
            (<ClipLoader color="#000" size={15}></ClipLoader>
          ) : (
          "Create your Amazone Account"
        )}
        </button>
        {
          error && 
            <small style={{padding:"5px", color:"red"}}>
              {error}
            </small>
        }
      </div>
    
      </section>
  )
}

export default Auth