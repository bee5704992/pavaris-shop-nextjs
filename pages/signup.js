import Head from 'next/head'
import Link from 'next/link'
import {useState, useContext, useEffect} from 'react'
import valid from '../utils/valid'      //import for validate at frontend
import { DataContext } from '../store/GlobalState'
import {postData} from '../utils/fetchData'
import {useRouter} from 'next/router'


const Signup = () => {
    const initialState = {name:'',email:'',password:'',cf_password:''}
    const [signupData,setSignupData] = useState(initialState)
    const {name,email,password,cf_password} = signupData

    const {state, dispatch} = useContext(DataContext)
    const {auth} = state
    
    const router = useRouter()

    const handleChangeInput = e => {
        const {name, value} = e.target
        setSignupData({...signupData, [name]:value})
        dispatch({type: 'NOTIFY', payload: {}})
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const errMsg = valid(name, email, password, cf_password)
        if(errMsg) return dispatch({type: 'NOTIFY', payload: {error: errMsg}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        const res = await postData('auth/signup', signupData)
        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        
        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }

    useEffect(() => {
        if(Object.keys(auth).length !== 0) router.push("/")
    }, [auth])

    return (
        <>
            <Head>
                <title>Pavaris SHOP | Sign up</title>
            </Head>
            <form className="mx-auto my-5" style={{maxWidth:'500px'}} onSubmit={handleSubmit}>      {/* mx-auto : Horizontal centering-กึ่งกลางแนวนอน,my-5 : เพิ่มmarginบนและล่าง-maxสุด5*/}
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={name} onChange={handleChangeInput} />
                </div>          
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" value={email} onChange={handleChangeInput}/>
                    <small id="emailHelp" className ="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" name="password" value={password} onChange={handleChangeInput}/>
                </div>
                <div className="form-group">
                    <label htmlFor="CFPassword1">Confirm password</label>
                    <input type="password" className="form-control" id="CFPassword1" name="cf_password" value={cf_password} onChange={handleChangeInput}/>
                </div>
                <button type="submit" className="btn btn-dark w-100">Register</button>     {/* w-100 : width: 100%*/}
                <p className="my-2">Already have an account? <Link href="/signin"><a style={{color:'crimson'}}>Login Now</a></Link></p>
            </form>
        </>
    )
}

export default Signup