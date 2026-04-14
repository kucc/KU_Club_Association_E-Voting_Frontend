type UserRole = 'REPRESENTATIVE' | 'AGENT';

export interface UserProfile {
  name: string;
  role: UserRole;
  club: string;
  position: string;
  department: string;
  studentId: string;
  status: string;
}
