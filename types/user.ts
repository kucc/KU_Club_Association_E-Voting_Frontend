// API response
export type User = {
  id: number;
  username: string;
  created_at?: string;
  isAdmin: boolean;
  isSubstitute?: boolean;
  is_admin?: boolean;
  is_substitute?: boolean;
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
  usesExecutiveTheme?: boolean;
  showsExecutiveBadge?: boolean;
  canOpenMemberResultPage?: boolean;
}
