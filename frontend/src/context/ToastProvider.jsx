import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const addToast = (type, message) => {
        const id = Date.now();

        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => removeToast(id), 3000);
    };

    const toast = {
        success: (msg) => addToast("success", msg),
        error: (msg) => addToast("error", msg),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            <div className="fixed top-5 right-5 space-y-3 z-[9999]">
                {toasts.map((t) => (
                    <Toast
                        key={t.id}
                        message={t.message}
                        type={t.type}
                        onClose={() => removeToast(t.id)} 
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
