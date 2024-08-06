import { useEffect } from "react";

interface ErrorMessageProps {
    message: string;
    clearMessage: () => void;
}

export default function Error({ message, clearMessage }: ErrorMessageProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            clearMessage();
        }, 5000);

        return () => clearTimeout(timer);
    }, [message, clearMessage]);

    return (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-lg">
            {message}
        </div>
    );
}
