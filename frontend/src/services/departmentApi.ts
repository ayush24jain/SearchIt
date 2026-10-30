
export interface Department {
  id: number;
  name: string;
  abbreviation: string | null;
}

interface DepartmentsApiResponse {
  success: boolean;
  count: number;
  data: Department[];
}

const API_BASE_URL = "http://localhost:3000/api";

export async function fetchDepartments(): Promise<Department[]> {
  const response = await fetch(`${API_BASE_URL}/departments`);

  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }

  const result: DepartmentsApiResponse = await response.json();

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("Invalid departments API response");
  }

  return result.data;
}
