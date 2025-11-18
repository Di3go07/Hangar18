import { BrowserRouter as Router, Link, Route, Routes, useParams,} from "react-router-dom";
import React, { useState, useEffect} from 'react';
import { doc, getDocs, updateDoc, setDoc, addDoc, deleteDoc, collection, query, where} from 'firebase/firestore';
import { db } from '../firebaseConnection';

function UserPage(){
    const {nome} = useParams();

    //Consts
    const [user, setUser] = useState();
    
    //Bools
    const [owner, setOwner] =  useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(null);

    //FUNCTIONS
    function capitalizeName(name) {
        if (!name) return '';
        return name.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }

    async function getUser(Ref, nome) {
        try{
            //search the user data by the name passed
            const q = query(Ref, where("name", "==", nome));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                setUser(doc.data());
                setLoading(false);
            } else {
                setLoading(false);
                setNotFound(true)
            }
        } catch (error) {
            console.error("Erro ao buscar usuario:", error);
            setLoading(false);
            setError(true);
        }
    }

    //USE EFFECT
    useEffect(() => {
        const loadUser = async () => {
            const userRef = collection(db, 'users');
            await getUser(userRef, nome)
        };
        loadUser();
    },[nome]);

    useEffect(() => {
        //verify if the user page is from the user logged in
        if (user){
            const data = localStorage.getItem("user");
            
            if (data) {
                const userLogged = JSON.parse(data);

                if ( userLogged.name == user.name){
                    setOwner(true)
                }
            }
        }
    },[user]);

    //WEB
    if (loading) return <div className="loading"> <p> Carregando... </p></div>;
    if (error) return <div className="loading"> <p> O sistema encontrou uma falha </p></div>;
    if (notFound) return <div className="loading"> <p> Nenhum usuário encontrado </p></div>;

    return(
    <div className='bg-Body ms-lg-5 me-lg-5 p-4'> 
        <h2> PERFIL </h2>
        <div className='m-4 p-2 d-flex align-items-center col-lg-9'>
            <div>
                <img className="icon-img" src='https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg'/>
            </div>
            <div className="ms-4 mt-1">
                <p className="fw-bold h3 text-white"> {capitalizeName(user.name)}  </p>
                <p className="fw-bold mt-1 h4 text-white"> {user.role} </p>
                <p className="fw-light mt-1"> {user.bio} </p>
                {owner && (
                    <div className="d-flex">
                        <a className="edit me-2" href="/login"> <i class="bi bi-box-arrow-right"></i> Sair </a>
                        <a className="edit" href="..."> <i class="bi bi-pencil"></i> Editar </a>  
                    </div>
                )}
            </div>
        </div>
        <hr style={{color:'black'}}/>
        <div className="mt-4">
            <h3> Publicações </h3>
        </div>
    </div> 
    )
}

export default UserPage