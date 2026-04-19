type UserRole = 'REPRESENTATIVE' | 'AGENT' | 'EXECUTIVE'; // REPRESENTATIVE = 대표자 | AGENT = 대리인 | EXECUTIVE = 전체 관리자

export interface UserProfile {
  name: string;
  role: UserRole;
  club: string;
  position: string;
  department: string;
  studentId: string;
  status: string;
}
