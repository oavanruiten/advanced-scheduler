export interface Trigger {
  uuid: string;
  name: string;
  value: string;
  frequencyType: FrequencyType;
  schedule: string;
  timezone: string;
  state: State;
  dyno: Dyno;
  timeout: number;
}

export enum FrequencyType {
  RECURRING = 'recurring',
  ONE_OFF = 'one-off',
}

export enum State {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

export enum Dyno {
  FREE = "Free",
  ECO = "Eco",
  HOBBY = "Hobby",
  BASIC = "Basic",
  STANDARD_1X = "Standard-1X",
  STANDARD_2X = "Standartd-2X",
  PERFORMANCE_M = "Performance-M",
  PERFORMANCE_L = "Performance-L",
  PERFORMANCE_L_RAM = "Performance-L-RAM",
  PERFORMANCE_XL = "Performance-XL",
  PERFORMANCE_2XL = "Performance-2XL",
  PRIVATE_S = "Private-S",
  PRIVATE_M = "Private-M",
  PRIVATE_L = "Private-L",
  PRIVATE_L_RAM = "Private-L-RAM",
  PRIVATE_XL = "Private-XL",
  PRIVATE_2XL = "Private-2XL",
  SHIELD_S = "Shield-S",
  SHIELD_M = "Shield-M",
  SHIELD_L = "Shield-L",
  SHIELD_L_RAM = "Shield-L-RAM",
  SHIELD_XL = "Shield-XL",
  SHIELD_2XL = "Shield-2XL",
}
