import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastProvider";

export default function EmployeeForm({ refresh, editingEmployee, closeModal, isOpen }) {
  const { toast } = useToast();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        first_name: editingEmployee.first_name,
        last_name: editingEmployee.last_name,
        email: editingEmployee.email,
        phone: editingEmployee.phone || "",
      });
    }
  }, [editingEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingEmployee) {
        await api.put(`/api/employees/${editingEmployee.id}`, form);
        toast.success("Employee updated successfully!");
      } else {
        await api.post("/api/employees", form);
        toast.success("Employee added successfully!");
      }

      setForm({ first_name: "", last_name: "", email: "", phone: "" });
      refresh();
      closeModal();

    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save employee");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          {editingEmployee ? "Update Employee" : "Add New Employee"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">

          <input
            type="text"
            placeholder="First Name"
            className="px-4 py-2 border rounded-lg"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            className="px-4 py-2 border rounded-lg"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border rounded-lg"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="tel"
            placeholder="Phone (optional)"
            className="px-4 py-2 border rounded-lg"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading
              ? "Saving..."
              : editingEmployee
                ? "Update Employee"
                : "Add Employee"}
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="mt-2 text-gray-600 hover:text-gray-800 underline"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
