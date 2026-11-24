export const USER_ID = 'marc';

export type SportName = 'Basketball' | 'Football' | 'Tennis';
export type Level = 'Beg.' | 'Int.' | 'Adv.';
export type Intensity = 'Casual' | 'Competitive';
export type AttendanceResult = 'Attended' | 'No-show';

export interface SportSkill {
  sport: SportName;
  level: Level;
}

export interface Profile {
  name: string;
  age: number;
  sports: SportSkill[];
  onboarded: boolean;
}

export interface Player {
  id: string;
  name: string;
  attended: number;
  noShow: number;
}

export interface Session {
  id: string;
  sport: SportName;
  level: Level;
  intensity: Intensity;
  startsAt: number;
  meetingPoint: string;
  hostId: string;
  spots: number;
  playerIds: string[];
  distanceKm: number;
  createdAt: number;
}

export interface PastGame {
  id: string;
  sport: SportName;
  level: Level;
  intensity: Intensity;
  startsAt: number;
  meetingPoint: string;
  hostId: string;
  spots: number;
  playerIds: string[];
  showedUp: Record<string, boolean>;
  userResult: AttendanceResult;
  confirmed: boolean;
  /** True once this game is already included in reliability totals. */
  counted: boolean;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  authorId: string;
  text: string;
  at: number;
}

export interface SessionDraft {
  sport: SportName;
  level: Level;
  intensity: Intensity;
  startsAt: number;
  meetingPoint: string;
  spots: number;
}

export interface AppState {
  profile: Profile;
  players: Player[];
  sessions: Session[];
  pastGames: PastGame[];
  messages: ChatMessage[];
  clockOrigin: number;
  timeOffsetMs: number;
}

export const SPORTS: SportName[] = ['Basketball', 'Football', 'Tennis'];
export const LEVELS: Level[] = ['Beg.', 'Int.', 'Adv.'];
export const INTENSITIES: Intensity[] = ['Casual', 'Competitive'];
export const PLACE_SUGGESTIONS = [
  'Campus Court #2',
  'Campus Field',
  'Turf Pitch B',
  'Park Courts',
];
