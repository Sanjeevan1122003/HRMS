import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter, List } from "lucide-react";
import { useToast } from "../context/ToastProvider";

export default function Logs() {
    const { toast } = useToast();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");
    const [action, setAction] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/logs", {
                params: { userId, action, from, to },
            });
            setLogs(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyFilters = () => {
        fetchLogs();
        toast.success("Filters applied");
    };

    const clearFilters = () => {
        setUserId("");
        setAction("");
        setFrom("");
        setTo("");
        fetchLogs();
        toast.success("Filters cleared");
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center space-x-4">
                    <Link to="/dashboard" className="text-gray-500 hover:text-gray-800">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <div className="flex items-center space-x-3">
                        <List className="w-6 h-6 text-blue-600" />
                        <h1 className="text-xl font-bold text-gray-900">Activity Logs</h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">

                <div className="bg-white shadow-md border rounded-lg p-5 mb-6">

                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-700" /> Filters
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <input
                            type="text"
                            placeholder="User ID"
                            className="px-4 py-2 border rounded-lg"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Action"
                            className="px-4 py-2 border rounded-lg"
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                        />

                        <input
                            type="date"
                            className="px-4 py-2 border rounded-lg"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        />

                        <input
                            type="date"
                            className="px-4 py-2 border rounded-lg"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Apply Filters
                        </button>

                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-md border rounded-lg p-6">

                    <h2 className="text-lg font-semibold mb-4">
                        Logs ({logs.length})
                    </h2>

                    {loading ? (
                        <div className="text-center py-6">Loading logs...</div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                            No logs found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 border">ID</th>
                                        <th className="p-3 border">User</th>
                                        <th className="p-3 border">Action</th>
                                        <th className="p-3 border">Meta</th>
                                        <th className="p-3 border">Timestamp</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="p-3 border">{log.id}</td>
                                            <td className="p-3 border">{log.user_id}</td>
                                            <td className="p-3 border">{log.action}</td>
                                            <td className="p-3 border text-sm text-gray-600">
                                                {JSON.stringify(log.meta)}
                                            </td>
                                            <td className="p-3 border">{new Date(log.timestamp).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
