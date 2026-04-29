export type ClubAccount = Readonly<{
  division: string;
  clubName: string;
  username: string;
}>;

export type AdminAccount = Readonly<{
  id?: number;
  username: string;
  position: '회장' | '부회장' | '관리자' | '분과장';
  division: string;
  authority: '관리자' | '투표자';
  usesExecutiveTheme?: boolean;
}>;

export const ADMIN_ACCOUNTS: readonly AdminAccount[] = [
  {
    id: 511,
    username: 'president',
    position: '회장',
    division: '전체 총괄',
    authority: '관리자',
  },
  {
    id: 512,
    username: 'vicepresident',
    position: '부회장',
    division: '전체 총괄',
    authority: '관리자',
  },
  {
    username: 'vice_president',
    position: '부회장',
    division: '전체 총괄',
    authority: '관리자',
  },
  {
    id: 19,
    username: 'admin',
    position: '관리자',
    division: '전체 총괄',
    authority: '관리자',
  },
  {
    username: 'musicart',
    position: '분과장',
    division: '기악예술분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'musicart_head',
    position: '분과장',
    division: '기악예술분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'social',
    position: '분과장',
    division: '사회분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'social_head',
    position: '분과장',
    division: '사회분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'lifeculture',
    position: '분과장',
    division: '생활문화분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'lifeculture_head',
    position: '분과장',
    division: '생활문화분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'performart',
    position: '분과장',
    division: '연행예술분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'performart_head',
    position: '분과장',
    division: '연행예술분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'humanities',
    position: '분과장',
    division: '인문과학분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'humanities_head',
    position: '분과장',
    division: '인문과학분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'creative',
    position: '분과장',
    division: '전시창작분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'creative_head',
    position: '분과장',
    division: '전시창작분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'religion',
    position: '분과장',
    division: '종교분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'religion_head',
    position: '분과장',
    division: '종교분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'sports',
    position: '분과장',
    division: '체육분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'sports_head',
    position: '분과장',
    division: '체육분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'research',
    position: '분과장',
    division: '학술연구분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
  {
    username: 'research_head',
    position: '분과장',
    division: '학술연구분과',
    authority: '투표자',
    usesExecutiveTheme: true,
  },
];

export const CLUB_ACCOUNTS: readonly ClubAccount[] = [
  { division: '기악예술분과', clubName: 'ATP', username: 'atp' },
  { division: '기악예술분과', clubName: 'JASS', username: 'jass' },
  { division: '기악예술분과', clubName: 'TTP', username: 'ttp' },
  { division: '기악예술분과', clubName: '고대농악대', username: 'nongakdae' },
  { division: '기악예술분과', clubName: '고전기타부', username: 'goguitar' },
  { division: '기악예술분과', clubName: '관악부', username: 'gwanak' },
  { division: '기악예술분과', clubName: '관현악단', username: 'orchestra' },
  { division: '기악예술분과', clubName: '국악연구회', username: 'gugak' },
  { division: '기악예술분과', clubName: '그루터기', username: 'gruteogi' },
  { division: '기악예술분과', clubName: '노래얼', username: 'noraeol' },
  { division: '기악예술분과', clubName: '크림슨', username: 'crimson' },
  { division: '사회분과', clubName: 'KURC', username: 'kurc' },
  { division: '사회분과', clubName: 'KUSA', username: 'kusa' },
  { division: '사회분과', clubName: 'KUSEP', username: 'kusep' },
  { division: '사회분과', clubName: '고려대고양이쉼터', username: 'kucat' },
  { division: '사회분과', clubName: '고집', username: 'gojip' },
  { division: '사회분과', clubName: '로타랙트', username: 'rotaract' },
  { division: '사회분과', clubName: '은하회', username: 'eunha' },
  { division: '사회분과', clubName: '자진근로반', username: 'jajin' },
  { division: '생활문화분과', clubName: 'Clo.Z', username: 'cloz' },
  { division: '생활문화분과', clubName: 'LECA', username: 'leca' },
  { division: '생활문화분과', clubName: 'KUSPA', username: 'kuspa' },
  { division: '생활문화분과', clubName: '고려다원', username: 'dawon' },
  { division: '생활문화분과', clubName: '기호회', username: 'giho' },
  { division: '생활문화분과', clubName: '뇌의주름', username: 'brainfold' },
  { division: '생활문화분과', clubName: '소믈리에', username: 'sommelier' },
  { division: '생활문화분과', clubName: '유스호스텔', username: 'yhostel' },
  {
    division: '생활문화분과',
    clubName: '커리손으로먹기연구회',
    username: 'curryhand',
  },
  { division: '생활문화분과', clubName: '한일문화연구회', username: 'hanil' },
  { division: '생활문화분과', clubName: '호진회', username: 'hojin' },
  { division: '연행예술분과', clubName: 'KUDT', username: 'kudt' },
  { division: '연행예술분과', clubName: 'LoGS', username: 'logs' },
  { division: '연행예술분과', clubName: 'TERRA', username: 'terra' },
  { division: '연행예술분과', clubName: '극예술연구회', username: 'geuk' },
  {
    division: '연행예술분과',
    clubName: '미스디렉션',
    username: 'misdirection',
  },
  { division: '연행예술분과', clubName: '불아스', username: 'bulas' },
  { division: '연행예술분과', clubName: '소울메이트', username: 'soulmate' },
  { division: '연행예술분과', clubName: '합창단', username: 'choir' },
  { division: '인문과학분과', clubName: 'UNSA', username: 'unsa' },
  { division: '인문과학분과', clubName: '고란도란', username: 'gorandoran' },
  { division: '인문과학분과', clubName: '리베르타스', username: 'libertas' },
  { division: '인문과학분과', clubName: '사람과사람', username: 'peoplenppl' },
  { division: '인문과학분과', clubName: '수레바퀴', username: 'surebakwi' },
  { division: '인문과학분과', clubName: '예술비평연구회', username: 'artcrit' },
  { division: '인문과학분과', clubName: '철학마을', username: 'philvillage' },
  {
    division: '인문과학분과',
    clubName: '한국근현대사연구회',
    username: 'kmodern',
  },
  {
    division: '인문과학분과',
    clubName: '한국사회연구회',
    username: 'ksociety',
  },
  { division: '인문과학분과', clubName: '호박회', username: 'hobak' },
  { division: '전시창작분과', clubName: 'PAPcon', username: 'papcon' },
  {
    division: '전시창작분과',
    clubName: '거의격월간몰라도되는데',
    username: 'mollado',
  },
  { division: '전시창작분과', clubName: '고대문학회', username: 'kumun' },
  { division: '전시창작분과', clubName: '그림마당', username: 'grim' },
  { division: '전시창작분과', clubName: '돌빛', username: 'dolbit' },
  { division: '전시창작분과', clubName: '서화회', username: 'seohwa' },
  { division: '전시창작분과', clubName: '캘리쿠', username: 'calliku' },
  { division: '전시창작분과', clubName: '큐리에이터', username: 'curiator' },
  { division: '전시창작분과', clubName: '한국화회', username: 'kpainting' },
  { division: '전시창작분과', clubName: '호영회', username: 'hoyeong' },
  { division: '종교분과', clubName: 'CCC', username: 'ccc' },
  { division: '종교분과', clubName: 'ENM', username: 'enm' },
  { division: '종교분과', clubName: 'IVF', username: 'ivf' },
  { division: '종교분과', clubName: 'JOY', username: 'joy' },
  { division: '종교분과', clubName: 'SFC', username: 'sfc' },
  { division: '종교분과', clubName: '불교학생회', username: 'buddhist' },
  { division: '종교분과', clubName: '예수전도단', username: 'yed' },
  { division: '종교분과', clubName: '원불교학생회', username: 'wonbuddhism' },
  { division: '종교분과', clubName: '젊은예수', username: 'youngjesus' },
  { division: '체육분과', clubName: 'ENTHES', username: 'enthes' },
  { division: '체육분과', clubName: 'FC엘리제', username: 'elisee' },
  { division: '체육분과', clubName: 'KUBC', username: 'kubc' },
  { division: '체육분과', clubName: 'KUBOX', username: 'kubox' },
  { division: '체육분과', clubName: 'KUBT', username: 'kubt' },
  { division: '체육분과', clubName: 'KUTR', username: 'kutr' },
  { division: '체육분과', clubName: 'KULAX', username: 'kulax' },
  { division: '체육분과', clubName: 'KUTIME', username: 'kutime' },
  { division: '체육분과', clubName: '궁도회', username: 'gungdo' },
  { division: '체육분과', clubName: '농구연구회', username: 'basketlab' },
  { division: '체육분과', clubName: '백구회', username: 'baekgu' },
  { division: '체육분과', clubName: '수호회', username: 'suho' },
  { division: '체육분과', clubName: '아마추어축구부', username: 'amafc' },
  { division: '체육분과', clubName: '탁구사랑회', username: 'ttlove' },
  { division: '체육분과', clubName: '택견한울', username: 'taekkyeon' },
  { division: '체육분과', clubName: '팬케이KU', username: 'pancaku' },
  { division: '체육분과', clubName: '한량회', username: 'hallyang' },
  { division: '학술연구분과', clubName: 'ALC', username: 'alc' },
  { division: '학술연구분과', clubName: 'ECS', username: 'ecs' },
  { division: '학술연구분과', clubName: 'KUCC', username: 'kucc' },
  { division: '학술연구분과', clubName: 'NewLearn', username: 'newlearn' },
  { division: '학술연구분과', clubName: '열두루달', username: 'yeolduru' },
];

const CLUB_ACCOUNT_BY_USERNAME = new Map(
  CLUB_ACCOUNTS.flatMap((account) => [
    [account.username, account] as const,
    [`${account.username}_sub`, account] as const,
  ]),
);

const ADMIN_ACCOUNTS_WITH_ID = ADMIN_ACCOUNTS.filter(
  (account): account is AdminAccount & { id: number } =>
    typeof account.id === 'number',
);

const ADMIN_ACCOUNT_BY_ID = new Map(
  ADMIN_ACCOUNTS_WITH_ID.map((account) => [account.id, account]),
);

const ADMIN_ACCOUNT_BY_USERNAME = new Map(
  ADMIN_ACCOUNTS.map((account) => [account.username, account]),
);

const ADMIN_POSITION_BY_ID = new Map(
  ADMIN_ACCOUNTS_WITH_ID.map((account) => [account.id, account.position]),
);

const ADMIN_POSITION_BY_USERNAME = new Map(
  ADMIN_ACCOUNTS.map((account) => [account.username, account.position]),
);

export const getClubAccountByUsername = (
  username: string,
): ClubAccount | undefined => {
  return CLUB_ACCOUNT_BY_USERNAME.get(username.trim().toLowerCase());
};

export const getAdminAccountByUsername = (
  username: string,
): AdminAccount | undefined => {
  return ADMIN_ACCOUNT_BY_USERNAME.get(username.trim().toLowerCase());
};

export const getAdminAccountById = (id: number): AdminAccount | undefined => {
  return ADMIN_ACCOUNT_BY_ID.get(id);
};

export const getAdminPositionById = (id: number): string | undefined => {
  return ADMIN_POSITION_BY_ID.get(id);
};

export const getAdminPositionByUsername = (
  username: string,
): string | undefined => {
  return ADMIN_POSITION_BY_USERNAME.get(username.trim().toLowerCase());
};
