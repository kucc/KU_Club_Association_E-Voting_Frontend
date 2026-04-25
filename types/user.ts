// API response
export type User = {
  id: number;
  username: string;
  created_at?: string;
  isAdmin: boolean;
  isSubstitute?: boolean;
};

// UI용
type UserRole = 'REPRESENTATIVE' | 'AGENT' | 'EXECUTIVE';

export interface UserProfile {
  name: string;
  role: UserRole;
  club: string;
  position: string;
  department: string;
  studentId: string;
  status: string;
}
