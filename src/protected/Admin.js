import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Admin({children}){
    const navigate = useNavigate();

    useEffect(() => {
        const data = localStorage.getItem("user");
        
        if (!data) {
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(data);
            if (user.role !== 'Administrador') {
                navigate('/login');
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate('/login');
        }
    }, [navigate]);

    const data = localStorage.getItem("user");
    if (!data) return null; 

    try {
        const user = JSON.parse(data);
        if (user.role === 'Administrador') {
            return children;
        }
    } catch {
        return null; 
    }

    return null; 
}