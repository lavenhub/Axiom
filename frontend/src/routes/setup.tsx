import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export const Route = createFileRoute("/setup")({
  component: SetupWizard,
});

const STEPS = [
  { id: "org", title: "Organization" },
  { id: "city", title: "City" },
  { id: "dept", title: "Department" },
  { id: "ward", title: "Ward" },
  { id: "engineer", title: "Engineer" },
  { id: "asset", title: "Asset" },
];

function SetupWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [orgId, setOrgId] = useState("");
  const [cityId, setCityId] = useState("");
  const [deptId, setDeptId] = useState("");
  const [wardId, setWardId] = useState("");
  const [assetTypeId, setAssetTypeId] = useState("");

  const [formData, setFormData] = useState({
    orgName: "NeoCity Municipal Corporation",
    cityName: "NeoCity",
    deptName: "Roads & Infrastructure",
    wardName: "Ward 7 – MG Road Zone",
    engineerName: "Priya Nair",
    engineerEmail: "priya@neocity.gov",
    assetName: "MG Road – Sector 4",
  });

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (step === 0) {
        const org = await api.setupOrganization(formData.orgName);
        setOrgId(org.id);
      } else if (step === 1) {
        const city = await api.setupCity(formData.cityName, orgId);
        setCityId(city.id);
      } else if (step === 2) {
        const dept = await api.setupDepartment({ name: formData.deptName, cityId });
        setDeptId(dept.id);
      } else if (step === 3) {
        const ward = await api.setupWard({ name: formData.wardName, number: 7, cityId });
        setWardId(ward.id);
      } else if (step === 4) {
        await api.setupEngineer({
          name: formData.engineerName,
          email: formData.engineerEmail,
          departmentId: deptId,
          cityId,
          organizationId: orgId,
        });
      } else if (step === 5) {
        const type = await api.setupInfrastructureType({ name: "Road", description: "Asphalt", icon: "road" });
        setAssetTypeId(type.id);
        
        await api.setupInfrastructureAsset({
          name: formData.assetName,
          description: "Main arterial road",
          typeId: type.id,
          wardId,
          latitude: "12.9716",
          longitude: "77.5946",
          address: "MG Road, Ward 7",
        });

        // Setup complete!
        navigate({ to: "/app" });
        return;
      }

      setStep(step + 1);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <h1 className="font-pixel text-4xl mb-2">City Initialization</h1>
          <p className="font-mono text-sm text-[var(--muted-foreground)]">Step {step + 1} of {STEPS.length}</p>
        </div>

        <div className="flex justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div
                className={`w-4 h-4 border-[2px] border-[var(--border)] ${
                  i < step ? "bg-[var(--accent)]" : i === step ? "bg-[var(--primary)] pulse-dot" : "bg-white"
                }`}
              />
              <span className={`font-pixel text-[10px] uppercase ${i === step ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <div className="pixel-card p-8">
          {error && <div className="mb-6 p-3 pixel-border bg-[#ffe5e5] text-[var(--destructive)] text-sm font-mono">{error}</div>}

          <form onSubmit={handleNext}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {step === 0 && (
                  <div>
                    <label className="block font-pixel text-sm uppercase mb-2">Organization Name</label>
                    <input required className="w-full pixel-card p-3 font-mono" value={formData.orgName} onChange={e => setFormData({...formData, orgName: e.target.value})} />
                  </div>
                )}
                {step === 1 && (
                  <div>
                    <label className="block font-pixel text-sm uppercase mb-2">City Name</label>
                    <input required className="w-full pixel-card p-3 font-mono" value={formData.cityName} onChange={e => setFormData({...formData, cityName: e.target.value})} />
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <label className="block font-pixel text-sm uppercase mb-2">Department</label>
                    <input required className="w-full pixel-card p-3 font-mono" value={formData.deptName} onChange={e => setFormData({...formData, deptName: e.target.value})} />
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <label className="block font-pixel text-sm uppercase mb-2">Ward Name</label>
                    <input required className="w-full pixel-card p-3 font-mono" value={formData.wardName} onChange={e => setFormData({...formData, wardName: e.target.value})} />
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-pixel text-sm uppercase mb-2">Engineer Name</label>
                      <input required className="w-full pixel-card p-3 font-mono" value={formData.engineerName} onChange={e => setFormData({...formData, engineerName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block font-pixel text-sm uppercase mb-2">Engineer Email</label>
                      <input required type="email" className="w-full pixel-card p-3 font-mono" value={formData.engineerEmail} onChange={e => setFormData({...formData, engineerEmail: e.target.value})} />
                    </div>
                  </div>
                )}
                {step === 5 && (
                  <div>
                    <label className="block font-pixel text-sm uppercase mb-2">Infrastructure Asset (Road)</label>
                    <input required className="w-full pixel-card p-3 font-mono" value={formData.assetName} onChange={e => setFormData({...formData, assetName: e.target.value})} />
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={loading} className="pixel-btn pixel-btn-primary px-8">
                    {loading ? "Processing..." : step === STEPS.length - 1 ? "Complete Setup" : "Next →"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
