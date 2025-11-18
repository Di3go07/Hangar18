import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Editor({children}){
    const navigate = useNavigate();

    useEffect(() => {
        const data = localStorage.getItem("user");
        
        if (!data) {
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(data);
            if (user.role !== 'Editor') {
                navigate('/login');
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate('/login');
        }
    }, [navigate]);

    const data = localStorage.getItem("user");
    if (!data) return null; // Ou um loading spinner

    try {
        const user = JSON.parse(data);
        if (user.role === 'Editor') {
            return children;
        }
    } catch {
        return null; // Ou um loading spinner
    }

    return null; // Caso não seja editor
}