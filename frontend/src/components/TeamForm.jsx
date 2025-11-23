import { useEffect, useState } from "react";
import api from "../services/api";
import { Plus, X } from "lucide-react";
import { useToast } from "../context/ToastProvider";

export default function TeamForm({ refresh, editingTeam, closeModal, isOpen }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTeam) {
      setForm({
        name: editingTeam.name || "",
        description: editingTeam.description || "",
      });
    } else {
      setForm({ name: "", description: "" });
    }
  }, [editingTeam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTeam) {
        await api.put(`/api/teams/${editingTeam.id}`, form);
        toast.success("Team updated successfully!");
      } else {
        await api.post("/api/teams", form);
        toast.success("Team created successfully!");
      }

      refresh();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        
        <button className="absolute top-3 right-3" onClick={closeModal}>
          <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {editingTeam ? "Edit Team" : "Create New Team"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Team Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 
                       focus:ring-2 focus:ring-blue-600"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Description (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 
                       focus:ring-2 focus:ring-blue-600"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white 
                       px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? "Saving..." : editingTeam ? "Update Team" : "Create Team"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
