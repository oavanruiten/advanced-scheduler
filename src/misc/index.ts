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
  HOBBY = "Hobby",
  STANDARD_1X = "Standard-1X",
  STANDARD_2X = "Standartd-2X",
  PERFORMANCE_M = "Performance-M",
  PERFORMANCE_L = "Performance-L",
  PRIVATE_S = "Private-S",
  PRIVATE_M = "Private-M",
  PRIVATE_L = "Private-L",
}
