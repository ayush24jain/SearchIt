
export type Faculty = {
  id: string
  fullName: string
  designation: string
  department: string
  administrativePositions: string[]
  email: string
  officePhone: string
  officeRoom: string
  officialProfileUrl: string
  isMock: true
}

// Fictional development records only.
// These are NOT real or verified SVNIT faculty details.
export const mockFaculty: Faculty[] = [
  {
    id: 'mock-001',
    fullName: 'Aarav Sharma',
    designation: 'Assistant Professor',
    department: 'Chemical Engineering',
    administrativePositions: [],
    email: 'aarav.sharma@example.com',
    officePhone: '02610000001',
    officeRoom: 'Room C-101',
    officialProfileUrl: '',
    isMock: true,
  },
  {
    id: 'mock-002',
    fullName: 'Meera Patel',
    designation: 'Associate Professor',
    department: 'Chemical Engineering',
    administrativePositions: ['Associate Dean'],
    email: 'meera.patel@example.com',
    officePhone: '02610000002',
    officeRoom: 'Room C-204',
    officialProfileUrl: '',
    isMock: true,
  },
  {
    id: 'mock-003',
    fullName: 'Rohan Mehta',
    designation: 'Professor',
    department: 'Computer Science and Engineering',
    administrativePositions: ['Dean Student Welfare'],
    email: 'rohan.mehta@example.com',
    officePhone: '02610000003',
    officeRoom: 'Room CS-110',
    officialProfileUrl: '',
    isMock: true,
  },
  {
    id: 'mock-004',
    fullName: 'Kavya Shah',
    designation: 'Assistant Professor',
    department: 'Artificial Intelligence',
    administrativePositions: [],
    email: 'kavya.shah@example.com',
    officePhone: '02610000004',
    officeRoom: 'Room AI-105',
    officialProfileUrl: '',
    isMock: true,
  },
  {
    id: 'mock-005',
    fullName: 'Nikhil Desai',
    designation: 'Professor',
    department: 'Electrical Engineering',
    administrativePositions: ['Associate Dean'],
    email: 'nikhil.desai@example.com',
    officePhone: '02610000005',
    officeRoom: 'Room E-202',
    officialProfileUrl: '',
    isMock: true,
  },
]
