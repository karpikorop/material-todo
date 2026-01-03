import { getTimeZones, TimeZone } from '@vvo/tzdb';

let cachedTimeZones: TimeZone[];
/**
 * Returns a list of all timezones
 * Some timezones are grouped together
 * Returns Utc timezone as well
 */
export function getTimeZonesList(): TimeZone[] {
  if (!cachedTimeZones) {
    cachedTimeZones = getTimeZones({ includeUtc: true });
  }
  return cachedTimeZones;
}

/**
 * Finds a matched timezone in a grouped list
 */
export function findTimeZone(
  timezone: string,
  timeZones = getTimeZonesList()
): TimeZone | undefined {
  return timeZones.find((timeZone) => {
    return timezone === timeZone.name || timeZone.group.includes(timezone);
  });
}
