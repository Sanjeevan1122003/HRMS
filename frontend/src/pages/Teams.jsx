import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import TeamForm from "../components/TeamForm";
import { UsersRound, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useToast } from "../context/ToastProvider";

export default function Teams() {
  const { toast } = useToast();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/teams");

      setTeams(res.data.data || []);


      if (res.data.message) toast.success(res.data.message);

    } catch (err) {
      toast.error("Failed to load teams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setSelectedTeam(null);
    setIsModalOpen(true);
  };

  const openEditModal = (team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const deleteTeam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      await api.delete(`/api/teams/${id}`);

      toast.success("Team deleted successfully");

      fetchTeams();
    } catch (err) {
      toast.error("Failed to delete team");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">

            <Link to="/dashboard" className="text-gray-500 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <UsersRound className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold">Teams</h1>

            <button
              onClick={openAddModal}
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Team
            </button>

          </div>
        </div>
      </nav>


      <TeamForm
        refresh={fetchTeams}
        editingTeam={selectedTeam}
        closeModal={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />


      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            All Teams ({teams.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8">No teams yet.</div>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="border rounded-lg p-4 flex justify-between items-center transition"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{team.name}</h3>
                    {team.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {team.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start space-y-2">

                    <button
                      onClick={() => openEditModal(team)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => deleteTeam(team.id)}
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
