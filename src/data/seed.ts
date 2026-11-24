import { atDayTime, createClockOrigin, nextWeekdayTime } from '../lib/time';
import type { AppState, PastGame, Player } from '../types';
import { USER_ID } from '../types';

function showedUp(ids: string[]): Record<string, boolean> {
  return Object.fromEntries(ids.map((id) => [id, true]));
}

export function createSeed(realNow = new Date()): AppState {
  const origin = createClockOrigin(realNow);

  const players: Player[] = [
    { id: USER_ID, name: 'Marc', attended: 19, noShow: 1 },
    { id: 'leo', name: 'Leo', attended: 22, noShow: 3 },
    { id: 'alex', name: 'Alex', attended: 23, noShow: 2 },
    { id: 'john', name: 'John', attended: 19, noShow: 6 },
    { id: 'sarah', name: 'Sarah', attended: 49, noShow: 1 },
    { id: 'sam', name: 'Sam', attended: 21, noShow: 4 },
    { id: 'nora', name: 'Nora', attended: 18, noShow: 2 },
    { id: 'dani', name: 'Dani', attended: 17, noShow: 4 },
    { id: 'iker', name: 'Iker', attended: 93, noShow: 7 },
    { id: 'paula', name: 'Paula', attended: 20, noShow: 3 },
    { id: 'ruben', name: 'Rubén', attended: 19, noShow: 5 },
  ];

  const past = (
    game: Omit<PastGame, 'showedUp' | 'userResult' | 'confirmed' | 'counted'> & { playerIds: string[] },
  ): PastGame => ({
    ...game,
    showedUp: showedUp(game.playerIds),
    userResult: 'Attended',
    confirmed: true,
    counted: true,
  });

  return {
    profile: {
      name: 'Marc',
      age: 21,
      sports: [],
      onboarded: false,
    },
    players,
    clockOrigin: origin,
    timeOffsetMs: 0,
    messages: [
      {
        id: 'm1',
        sessionId: 's1',
        authorId: 'leo',
        text: 'What should I bring?',
        at: origin - 3_600_000,
      },
      {
        id: 'm2',
        sessionId: 's1',
        authorId: USER_ID,
        text: 'Just water, balls are there.',
        at: origin - 3_500_000,
      },
    ],
    sessions: [
      {
        id: 's1',
        sport: 'Basketball',
        level: 'Int.',
        intensity: 'Casual',
        startsAt: atDayTime(origin, 0, 18),
        meetingPoint: 'Campus Court #2',
        hostId: USER_ID,
        spots: 10,
        playerIds: [USER_ID, 'leo', 'alex', 'john', 'sarah', 'sam'],
        distanceKm: 0.4,
        createdAt: origin,
      },
      {
        id: 's2',
        sport: 'Football',
        level: 'Adv.',
        intensity: 'Competitive',
        startsAt: atDayTime(origin, 0, 20),
        meetingPoint: 'Turf Pitch B',
        hostId: 'dani',
        spots: 10,
        playerIds: ['dani', USER_ID, 'leo', 'alex', 'john', 'sarah', 'sam', 'nora'],
        distanceKm: 1.2,
        createdAt: origin - 1,
      },
      {
        id: 's3',
        sport: 'Basketball',
        level: 'Adv.',
        intensity: 'Competitive',
        startsAt: atDayTime(origin, 1, 19),
        meetingPoint: 'Sports Hall Court 1',
        hostId: 'nora',
        spots: 10,
        playerIds: ['nora', 'leo', 'alex', 'iker'],
        distanceKm: 0.8,
        createdAt: origin - 2,
      },
      {
        id: 's4',
        sport: 'Tennis',
        level: 'Beg.',
        intensity: 'Casual',
        startsAt: atDayTime(origin, 1, 17),
        meetingPoint: 'Park Courts',
        hostId: 'paula',
        spots: 4,
        playerIds: ['paula', 'ruben'],
        distanceKm: 2.1,
        createdAt: origin - 3,
      },
      {
        id: 's5',
        sport: 'Football',
        level: 'Int.',
        intensity: 'Casual',
        startsAt: nextWeekdayTime(origin, 6, 11),
        meetingPoint: 'Campus Field',
        hostId: 'ruben',
        spots: 10,
        playerIds: ['ruben', 'leo', 'alex', 'john', 'sarah', 'sam', 'nora', 'dani', 'paula'],
        distanceKm: 0.6,
        createdAt: origin - 4,
      },
      {
        id: 's6',
        sport: 'Basketball',
        level: 'Beg.',
        intensity: 'Casual',
        startsAt: nextWeekdayTime(origin, 0, 10),
        meetingPoint: 'Campus Court #1',
        hostId: 'iker',
        spots: 10,
        playerIds: ['iker', 'leo', 'alex', 'john', 'sarah', 'sam', 'nora', 'dani', 'paula', 'ruben'],
        distanceKm: 0.3,
        createdAt: origin - 5,
      },
    ],
    pastGames: [
      past({
        id: 'p1',
        sport: 'Basketball',
        level: 'Int.',
        intensity: 'Casual',
        startsAt: atDayTime(origin, -1, 18),
        meetingPoint: 'Campus Court #2',
        hostId: USER_ID,
        spots: 10,
        playerIds: [USER_ID, 'leo', 'alex', 'john', 'sarah'],
      }),
      past({
        id: 'p2',
        sport: 'Football',
        level: 'Adv.',
        intensity: 'Competitive',
        startsAt: atDayTime(origin, -4, 20),
        meetingPoint: 'Turf Pitch B',
        hostId: 'dani',
        spots: 10,
        playerIds: ['dani', USER_ID, 'leo', 'alex'],
      }),
      past({
        id: 'p3',
        sport: 'Football',
        level: 'Int.',
        intensity: 'Casual',
        startsAt: atDayTime(origin, -8, 11),
        meetingPoint: 'Campus Field',
        hostId: 'ruben',
        spots: 10,
        playerIds: ['ruben', USER_ID, 'paula', 'iker'],
      }),
    ],
  };
}
