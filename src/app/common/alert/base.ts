export enum AlertType {
  Confirm = 'CONFIRM',
  Notification = 'NOTIFICATION',
  Actions = 'ACTIONS',
  Tutorial = 'TUTORIAL',
  PromptStatus = 'PROMPT_STATUS',
  Input = 'INPUT',
  Range = 'RANGE'
}

export const maxStatus = 14;

export enum AlertButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
  Dark = 'dark',
  Danger = 'danger',
  Light = 'light',
}

export interface AlertButton {
  type: AlertButtonType;
  label: string;
  value: any;
}

export type AlertButtons = AlertButton[];
export type AlertInputs = AlertInput[];

export interface AlertOption {
  title: string;
  description?: string;
}

export interface AlertActionsOption extends AlertOption {
  buttons: AlertButtons;
}

export interface AlertTutorialOption extends AlertOption {
  title: string;
  steps: string[];
}

export interface AlertInputsOption extends AlertOption {
  inputs: AlertInputs;
}

export interface AlertRangeOption extends AlertOption {
  max: number;
  min: number;
  value: number;
}

export interface AlertInput  {
  name: string;
  type: 'checkbox' | 'radio';
  label: string;
  value: any;
  checked: boolean;
}
