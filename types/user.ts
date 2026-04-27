// API response
export type User = {
  id: number;
  username: string;
  created_at?: string;
  isAdmin: boolean;
  isSubstitute?: boolean;
  original_user_id: number | null;
};

// UI용
export type UserRole = 'REPRESENTATIVE' | 'AGENT' | 'EXECUTIVE';

export interface UserProfile {
  name: string;
  role: UserRole;
  club: string;
  position: string;
  department: string;
  studentId: string;
  status: string;
}
