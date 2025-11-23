
export default function Toast({ type, message, onClose }) {
    return (
        <div
            className={`px-4 py-3 rounded-lg shadow-lg text-white cursor-pointer
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
            onClick={onClose}
        >
            {message}
        </div>
    );
}
