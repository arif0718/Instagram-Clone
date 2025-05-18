import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Label } from '@radix-ui/react-label'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice.js'

const Login = () => {
    const [input, setInput] = useState({
        email:"",
        password:""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]:e.target.value});
    };

    const signInHandler = async (e) => {
        e.preventDefault();              //preventing to refress the page buz after refressing page data may lose
        try {
            setLoading(true);
            const res = await axios.post('https://instavibe-uzz9.onrender.com/api/v1/user/login',input, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email:"",
                    password:""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={signInHandler} className='shadow-lg flex flex-col gap-5 p-8'>
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
            </div>
            
            <div>
                <Label className='font-medium'>Email</Label>
                <Input
                type='email'
                name='email'
                value={input.email}
                onChange={changeEventHandler}
                className="focus-visible:ring-tranparent my-2"
                />
            </div>
            <div>
                <Label className='font-medium'>Password</Label>
                <Input
                type='password'
                name='password'
                value={input.password}
                onChange={changeEventHandler}
                className="focus-visible:ring-tranparent my-2"
                />
            </div>

            {/* code for showing loading logo in button */}
            {
                loading?(
                    <Button>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                        Please wait 
                    </Button>
                ):(
                    <Button type='submit'>Login</Button>
                )
            }

            <span className='text-center'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>

        </form>
    </div>
  )
}

export default Login