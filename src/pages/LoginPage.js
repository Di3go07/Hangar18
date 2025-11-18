import * as Icon from 'react-bootstrap-icons';
import React, { useState, useEffect, useMemo} from 'react';
import { db } from '../firebaseConnection';
import { doc, setDoc, addDoc, getDocs, collection, where, query} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

function LoginPage(){
    //STATES 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
      const data = localStorage.getItem("user");

      if (data){
        localStorage.removeItem("user");
      }
    }, []);

    async function completeLogin(e){
        e.preventDefault();

        //password cryptography to compare
        const salt = await bcrypt.genSalt(10);

        if (email=='' || password==''){
            setMessage('Validation failed. Please fill all required fields.');
        } else {
            try{
                const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) { 
                    const user = querySnapshot.docs[0].data()

                    const isMatch = await bcrypt.compare(password, user.password);
                    if (isMatch){
                        console.log(user)
                        localStorage.setItem('user', JSON.stringify(user))
                    } else {
                        setMessage('Wrong password!')
                        return
                    }
                } else {
                    setMessage('User do not exist')
                    return 
                }
                            
                navigate('/home')
            } catch (err) {
                console.log('An error occurred: ', err.message);
                setMessage('Failed to login');
            } finally {
                setEmail('')
                setPassword('')
            }
        }
    }

    return(
        <div>
            <div >
                <h1 className='d-flex justify-content-center align-items-center pt-4 pb-4'>
                    HANGAR 18
                </h1>
            </div>

            <div className='form-group bg-Body ms-lg-5 me-lg-5 p-4'>

                {message != '' &&
                    <div className='messageArea'>
                        <p className='messageText'> {message} </p>
                    </div>
                }

                <h2> Login </h2>
                <h4 className='subtitle mt-2 mb-4'> Entre com sua conta para realizar postagens </h4>

                <form className='row' onSubmit={completeLogin}>
                    <div className='col-10'>
                        <label for="basic-url" class="form-label">Email</label>
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon3"> <i class="bi bi-person-fill p-0"></i></span>
                            <input 
                                type="email" 
                                value={email}
                                class="form-control" 
                                id="basic-url" 
                                aria-describedby="basic-addon3 basic-addon4" 
                                onChange={(e) => setEmail(e.target.value)}    
                                required                        
                            />
                        </div>

                        <label for="basic-url" class="form-label mt-2">Password</label>
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon3"> <i class="bi bi-lock-fill p-0"></i> </span>
                            <input 
                                type="password" 
                                value={password}
                                class="form-control" 
                                id="basic-url" 
                                aria-describedby="basic-addon3 basic-addon4"
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />
                        </div>

                        <button type='submit' className='saveButton'> Login </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default LoginPage