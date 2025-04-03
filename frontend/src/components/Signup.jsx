import React, { useState } from 'react'
import { Input } from './ui/input'
import { Label } from '@radix-ui/react-label'
import { Button } from './ui/button'

function Signup() {
    const [input, setInput] = useState({
        username:"",
        email:"",
        password:""
    });
    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]:e.target.value});
    };

    const signupHandler = async (e) => {
        e.preventDefault();              //preventing to refress the page buz after refressing page data may lose
        try {
            
        } catch (error) {
            
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
        </form>
    </div>
  )
}

export default Signup