const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3001") + "/api";

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("axiom_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Auth
  async register(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async login(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Setup
  async setupOrganization(name: string): Promise<any> {
    const res = await fetch(`${API_BASE}/setup/organization`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async setupCity(name: string, organizationId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/setup/city`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, organizationId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async setupDepartment(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/setup/department`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async setupWard(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/setup/ward`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async setupEngineer(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/setup/engineer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async setupInfrastructureType(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/setup/infrastructure-type`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async setupInfrastructureAsset(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/setup/infrastructure-asset`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Issues & Repairs
  async createIssue(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/issues`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async getIssues(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/issues`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.issues || [];
  },
  async assignRepair(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/repairs`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async completeRepair(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/repairs/${id}/complete`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // AI & Knowledge
  async askAxiom(question: string): Promise<any> {
    const res = await fetch(`${API_BASE}/ai/ask`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async getMemories(): Promise<any> {
    const res = await fetch(`${API_BASE}/memories`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async getGraph(): Promise<any> {
    const res = await fetch(`${API_BASE}/memories/graph`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async getPredictions(): Promise<any> {
    const res = await fetch(`${API_BASE}/predictions`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async getAnalyticsDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
