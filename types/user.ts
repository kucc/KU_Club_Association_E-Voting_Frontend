// API response
export type User = {
  id: number;
  username: string;
  created_at: string;
  is_admin: boolean;
};

// UI용
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
