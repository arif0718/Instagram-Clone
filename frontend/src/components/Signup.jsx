import React, { useState } from 'react'
import { Input } from './ui/input'
import { Label } from '@radix-ui/react-label'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

const Signup = () => {
    const [input, setInput] = useState({
        username:"",
        email:"",
        password:""
    });
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]:e.target.value});
    };

    const signupHandler = async (e) => {
        e.preventDefault();              //preventing to refress the page buz after refressing page data may lose
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/register',input, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                toast.success(res.data.message);
                setInput({
                    username:"",
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
        <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
            </div>
            <div>
                <Label className='font-medium'>Username</Label>
                <Input
                type='text'
                name='username'
                value={input.username}
                onChange={changeEventHandler}
                className="focus-visible:ring-tranparent my-2"
                />
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
            <Button type='submit'>Signup</Button>
            <span className='text-center'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
        </form>
    </div>
  )
}

export default Signup