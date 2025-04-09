import React, { useState } from 'react'
import { Input } from './ui/input'
import { Label } from '@radix-ui/react-label'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'

const Login = () => {
    const [input, setInput] = useState({
        email:"",
        password:""
    });
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]:e.target.value});
    };

    const signInHandler = async (e) => {
        e.preventDefault();              //preventing to refress the page buz after refressing page data may lose
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login',input, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
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
            <Button type='submit'>Login</Button>
        </form>
    </div>
  )
}

export default Login