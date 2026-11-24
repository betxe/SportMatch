export function mapsSearchUrl(place: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, Barcelona`)}`;
}
