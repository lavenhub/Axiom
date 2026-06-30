import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.register({ ...formData, role: "ADMIN" });
      localStorage.setItem("axiom_token", data.token);
      localStorage.setItem("axiom_user", JSON.stringify(data.user));
      navigate({ to: "/setup" });
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md pixel-card p-8">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-4xl mb-2">Axiom</h1>
          <p className="font-mono text-sm text-[var(--muted-foreground)]">City Memory Engine · Admin Registration</p>
        </div>

        {error && (
          <div className="mb-6 p-3 pixel-border bg-[#ffe5e5] text-[var(--destructive)] text-sm font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-pixel text-xs tracking-widest uppercase mb-1">Full Name</label>
            <input
              required
              className="w-full pixel-card p-3 font-mono text-sm outline-none"
              placeholder="e.g. Alex Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-pixel text-xs tracking-widest uppercase mb-1">Government Email</label>
            <input
              required
              type="email"
              className="w-full pixel-card p-3 font-mono text-sm outline-none"
              placeholder="alex@neocity.gov"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-pixel text-xs tracking-widest uppercase mb-1">Password</label>
            <input
              required
              type="password"
              className="w-full pixel-card p-3 font-mono text-sm outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full pixel-btn pixel-btn-primary py-3 mt-4 text-lg"
          >
            {loading ? "Registering..." : "Register Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
