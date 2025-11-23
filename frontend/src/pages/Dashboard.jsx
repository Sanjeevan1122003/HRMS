import { Link } from "react-router-dom";
import {
  Users,
  UsersRound,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  FileText
} from "lucide-react";

import { useToast } from "../context/ToastProvider";

export default function Dashboard() {

  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-3">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">HRMS Dashboard</h1>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">
            Manage your organization's human resources efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <Link
            to="/employees"
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-8 border border-gray-200 hover:border-blue-600"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-600/10 p-4 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Employees</h3>
            </div>
            <p className="text-gray-600">
              Manage employee records and personal information.
            </p>
          </Link>

          <Link
            to="/teams"
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-8 border border-gray-200 hover:border-purple-600"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-600/10 p-4 rounded-lg group-hover:bg-purple-600/20 transition-colors">
                <UsersRound className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Teams</h3>
            </div>
            <p className="text-gray-600">
              Organize employees into teams and work groups.
            </p>
          </Link>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <Link
            to="/assign"
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-8 border border-gray-200 hover:border-green-600"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-green-600/10 p-4 rounded-lg group-hover:bg-green-600/20 transition-colors">
                <ClipboardList className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Assignments</h3>
            </div>
            <p className="text-gray-600">
              Assign employees to teams and manage coordination.
            </p>
          </Link>
          
          <Link
            to="/logs"
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-8 border border-gray-200 hover:border-orange-600"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-orange-600/10 p-4 rounded-lg group-hover:bg-orange-600/20 transition-colors">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Logs</h3>
            </div>
            <p className="text-gray-600">
              View activity logs — actions, users, timestamps & more.
            </p>
          </Link>

        </div>

      </main>
    </div>
  );
}
