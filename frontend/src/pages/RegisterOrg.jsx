import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Building2 } from "lucide-react";
import { useToast } from "../context/ToastProvider";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    orgName: "",
    adminName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/auth/register", form);

      toast.success("Organisation registered successfully!");

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8">

          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Register Your Organisation
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            Create a new HRMS account for your company
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Organisation Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-foreground"
                placeholder="Acme Corporation"
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Admin Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-foreground"
                placeholder="John Doe"
                value={form.adminName}
                onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-foreground"
                placeholder="admin@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-foreground"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium 
                         hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 hover:underline font-medium">
              Sign in
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
