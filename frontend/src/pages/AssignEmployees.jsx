import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  UsersRound,
  ArrowLeft,
  UserPlus,
  UserMinus,
  ChevronDown,
} from "lucide-react";
import { useToast } from "../context/ToastProvider";

export default function AssignEmployees() {
  const { toast } = useToast();

  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selection, setSelection] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await api.get("/api/teams");
      setTeams(res.data.data || []);
    } catch {
      toast.error("Failed to load teams.");
    }
  }, [toast]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/api/employees");
      setEmployees(res.data.data || []);
    } catch {
      toast.error("Failed to load employees.");
    }
  }, [toast]);

  const fetchAssignedEmployees = useCallback(
    async (teamId) => {
      setAssignLoading(true);
      try {
        const res = await api.get(`/api/teams/${teamId}/employees`);
        setAssignedEmployees(res.data.employees || []);
      } catch {
        setAssignedEmployees([]);
      } finally {
        setAssignLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    Promise.all([fetchTeams(), fetchEmployees()]).finally(() =>
      setLoading(false)
    );
  }, [fetchTeams, fetchEmployees]);

  useEffect(() => {
    if (selectedTeam) fetchAssignedEmployees(selectedTeam);
  }, [selectedTeam, fetchAssignedEmployees]);

  const assign = async () => {
    try {
      await api.post(`/api/teams/${selectedTeam}/assign`, {
        employeeIds: selection,
      });

      toast.success("Employees assigned successfully!");

      setModalOpen(false);
      setSelection([]);
      fetchAssignedEmployees(selectedTeam);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to assign employees.");
    }
  };

  const unassign = async (empId) => {
    try {
      await api.delete(`/api/teams/${selectedTeam}/unassign`, {
        data: { employeeId: empId },
      });

      toast.success("Employee removed from team.");
      fetchAssignedEmployees(selectedTeam);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to remove employee.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-green-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center space-x-4">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center space-x-3">
            <UsersRound className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Assign Employees
            </h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border shadow-md p-6 rounded-xl mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Choose a Team
          </label>

          <div className="relative">
            <select
              className="w-full appearance-none px-4 py-3 border rounded-lg bg-white text-gray-800 
                         shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">-- Select Team --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

            <ChevronDown className="w-5 h-5 absolute right-3 top-3 text-gray-600 pointer-events-none" />
          </div>
        </div>

        {selectedTeam && (
          <div className="bg-white border shadow-md p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Assigned Employees ({assignedEmployees.length})
              </h2>

              <button
                onClick={() => setModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <UserPlus className="w-4 h-4" />
                <span>Assign Employees</span>
              </button>
            </div>

            {assignLoading ? (
              <div className="py-10 flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-green-600 rounded-full"></div>
              </div>
            ) : assignedEmployees.length === 0 ? (
              <p className="text-gray-500 py-6 text-center">
                No employees assigned to this team.
              </p>
            ) : (
              <div className="space-y-4">
                {assignedEmployees.map((emp) => (
                  <div
                    key={emp.employee_id}
                    className="border border-gray-200 bg-gray-50 p-4 rounded-xl shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {emp.first_name} {emp.last_name}
                      </h3>
                      <p className="text-gray-600 text-sm">{emp.email}</p>
                    </div>

                    <button
                      onClick={() => unassign(emp.employee_id)}
                      className="text-red-600 hover:text-red-800 flex items-center space-x-1 font-medium"
                    >
                      <UserMinus className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 w-full max-w-lg rounded-xl shadow-2xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Assign Employees
              </h2>

              <div className="max-h-72 overflow-y-auto border rounded-lg p-3 divide-y">
                {employees.map((emp) => (
                  <label key={emp.id} className="flex items-center justify-between py-3">
                    <span className="font-medium text-gray-700">
                      {emp.first_name} {emp.last_name}{" "}
                      <span className="text-gray-500">({emp.email})</span>
                    </span>

                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      checked={selection.includes(emp.id)}
                      onChange={() => {
                        if (selection.includes(emp.id)) {
                          setSelection(selection.filter((id) => id !== emp.id));
                        } else {
                          setSelection([...selection, emp.id]);
                        }
                      }}
                    />
                  </label>
                ))}
              </div>

              <div className="flex justify-end mt-5 space-x-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={assign}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Assign Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
