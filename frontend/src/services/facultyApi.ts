
import type { Faculty } from '../data/faculty'

type ApiFaculty = {
  id: string | number
  full_name: string
  designation: string | null
  email: string | null
  office_phone: string | null
  office_room: string | null
  administrative_position: string | null
  source_url: string | null
  department_name: string | null
  photo_url: string | null
}

type FacultyApiResponse = {
  success: boolean
  count: number
  data: ApiFaculty[]
}

import API_BASE_URL from "./api";

function mapFaculty(record: ApiFaculty): Faculty {
  return {
    id: String(record.id),
    fullName: record.full_name,
    designation: record.designation ?? '',
    department: record.department_name ?? '',
    administrativePositions: record.administrative_position
      ? [record.administrative_position]
      : [],
    email: record.email ?? '',
    officePhone: record.office_phone ?? '',
    officeRoom: record.office_room ?? '',
    officialProfileUrl: record.source_url ?? '',
    photoUrl: record.photo_url ?? null,
    isMock: false,
  }
}

export async function fetchFaculty(
  search = '',
  department = '',
): Promise<Faculty[]> {
  const params = new URLSearchParams()

  if (search.trim()) {
    params.set('search', search.trim())
  }

  if (department.trim()) {
    params.set('department', department.trim())
  }

  const query = params.toString()
  const url = `${API_BASE_URL}/faculty${query ? `?${query}` : ''}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Faculty API request failed: HTTP ${response.status}`,
    )
  }

  const result: FacultyApiResponse = await response.json()

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error(
      'The faculty API returned an unexpected response.',
    )
  }

  return result.data.map(mapFaculty)
}
