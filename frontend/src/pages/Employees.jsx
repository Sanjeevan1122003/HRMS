import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import EmployeeForm from "../components/EmployeeForm";
import { Users, ArrowLeft, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { useToast } from "../context/ToastProvider";

export default function Employees() {
  const { toast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/employees");

      setEmployees(res.data.data || []);

      if (res.data.message) {
        toast.success(res.data.message);
      }

    } catch (err) {
      toast.error("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/api/employees/${id}`);

      toast.success("Employee deleted successfully!");

      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete employee");
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <nav className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold">Employees</h1>
            </div>

            <button
              onClick={openAddModal}
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Employee
            </button>
          </div>
        </div>
      </nav>

      <EmployeeForm
        refresh={fetchEmployees}
        editingEmployee={selectedEmployee}
        closeModal={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            All Employees ({employees.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8">No employees yet.</div>
          ) : (
            <div className="space-y-3">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">
                      {employee.first_name} {employee.last_name}
                    </h3>

                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{employee.email}</span>
                      </div>

                      {employee.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{employee.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">

                    <button
                      onClick={() => openEditModal(employee)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    
                    <button
                      onClick={() => deleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
