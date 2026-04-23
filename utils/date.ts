import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatLaunchDate(dateUtc: string): string {
  return format(parseISO(dateUtc), "dd MMM yyyy, HH:mm 'UTC'");
}

export function formatLaunchDateShort(dateUtc: string): string {
  return format(parseISO(dateUtc), "MMM yyyy");
}

export function formatRelativeDate(dateUtc: string): string {
  return formatDistanceToNow(parseISO(dateUtc), { addSuffix: true });
}