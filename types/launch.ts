export interface Links {
  patch: {
    small: string | null;
    large: string | null;
  };
  reddit: {
    campaign: string | null;
    launch: string | null;
    media: string | null;
    recovery: string | null;
  };
  flickr: {
    small: string[];
    original: string[];
  };
  presskit: string | null;
  webcast: string | null;
  youtube_id: string | null;
  article: string | null;
  wikipedia: string | null;
}

export interface Fairings {
  reused: boolean | null;
  recovery_attempt: boolean | null;
  recovered: boolean | null;
  ships: string[];
}

export interface Core {
  core: string | null;
  flight: number | null;
  gridfins: boolean | null;
  legs: boolean | null;
  reused: boolean | null;
  landing_attempt: boolean | null;
  landing_success: boolean | null;
  landing_type: string | null;
  landpad: string | null;
}

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  date_local: string;
  date_unix: number;
  date_precision: "half" | "quarter" | "year" | "month" | "day" | "hour";
  upcoming: boolean;
  success: boolean | null;
  details: string | null;
  rocket: string;
  launchpad: string;
  payloads: string[];
  cores: Core[];
  crew: string[];
  ships: string[];
  capsules: string[];
  links: Links;
  fairings: Fairings | null;
  auto_update: boolean;
  tbd: boolean;
  launch_library_id: string | null;
  net: boolean;
  window: number | null;
  static_fire_date_utc: string | null;
  static_fire_date_unix: number | null;
  flight_number: number;
}