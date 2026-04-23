export interface RocketDimension {
  meters: number | null;
  feet: number | null;
}

export interface RocketMass {
  kg: number | null;
  lb: number | null;
}

export interface PayloadWeight {
  id: string;
  name: string;
  kg: number | null;
  lb: number | null;
}

export interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  height: RocketDimension;
  diameter: RocketDimension;
  mass: RocketMass;
  payload_weights: PayloadWeight[];
  description: string;
  wikipedia: string;
  flickr_images: string[];
}