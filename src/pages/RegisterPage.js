import * as Icon from 'react-bootstrap-icons';
import React, { useState, useEffect, useMemo} from 'react';
import { db } from '../firebaseConnection';
import { doc, setDoc, addDoc, collection} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

function RegisterPage(){
    //STATES 
    const [id, setId] = useState(Date.now())
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Autor');
    const navigate = useNavigate();

    async function completeRegister(e){
        e.preventDefault();

        //password cryptography
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (name=='' && email=='' && password==''){
            alert('Validation failed. Please fill all required fields.');
        } else {
            try{
                const userRef = await addDoc(collection(db, "users"),
                    {
                        ID: id,
                        name: name.toLowerCase(),
                        email: email.toLowerCase(),
                        password: hashedPassword,
                        role: role,
                        bio: 'Sou um novo usuário!'
                    }
                );
                console.log('New user registred:', userRef.id);
                            
                navigate('/login')
            } catch (err) {
                console.log('An error occurred: ', err.message);
                alert('Failed to register');
            } finally {
                setName('')
                setEmail('')
                setPassword('')
                setRole('Autor')
                setId(Date.now())
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
                <h2> Registrar </h2>
                <h4 className='subtitle mt-2 mb-4'> Crie uma conta para um novo funcionário </h4>

                <form className='row' onSubmit={completeRegister}>
                    <div className='col-10'>
                        <label for="basic-url" class="form-label">Name</label>
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon3"> <i class="bi bi-person-fill p-0"></i></span>
                            <input 
                                type="text" 
                                value={name}
                                class="form-control" 
                                id="basic-url" 
                                aria-describedby="basic-addon3 basic-addon4" 
                                onChange={(e) => setName(e.target.value)}    
                                required                        
                            />
                        </div>
                        <label for="basic-url" class="form-label mt-2">Email</label>
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon3"> <i class="bi bi-envelope-fill p-0"></i> </span>
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

                        <div className='d-flex flex-column flex-fill mt-2'>
                            <label class="form-label"> Role </label>
                            <select className='form-select' name="tipo" value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option> Autor </option>
                                <option> Editor </option>
                                <option> Administrador </option>
                            </select>
                        </div>

                        <button type='submit' className='saveButton'> Registrar </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default RegisterPage