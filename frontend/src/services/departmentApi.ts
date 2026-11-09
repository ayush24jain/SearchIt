import API_BASE_URL from "./api";

export interface Department {
  id: number;
  name: string;
  abbreviation: string | null;
}

interface ApiDepartment {
  id: string | number;
  name: string;
  abbreviation: string | null;
}

interface DepartmentsApiResponse {
  success: boolean;
  count: number;
  data: ApiDepartment[];
}

export async function fetchDepartments(): Promise<Department[]> {
  const response = await fetch(`${API_BASE_URL}/departments`);

  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }

  const result: DepartmentsApiResponse = await response.json();

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("Invalid departments API response");
  }

  return result.data.map((department) => ({
    ...department,
    id: Number(department.id),
  }));
}