import type { Player } from '../types';

export function reliability(player: Player): number {
  const total = player.attended + player.noShow;
  if (total <= 0) return 100;
  return Math.round((player.attended / total) * 100);
}

export function findPlayer(players: Player[], id: string): Player | undefined {
  return players.find((player) => player.id === id);
}
