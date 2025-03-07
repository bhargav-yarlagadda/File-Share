import { useEffect, useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export const ErrorMessage = ({ message }: { message: string }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-amber-200 text-red-700 border border-red-400 rounded-md p-3 flex items-center gap-2 shadow-md 
            animate-fade-in-out">
            <AiOutlineExclamationCircle />
            <span>{message}</span>
        </div>
    );
};