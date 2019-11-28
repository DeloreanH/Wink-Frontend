export enum AlertType {
  Comfirm = 'CONFIRM',
  Notification = 'NOTIFICATION',
  Actions = 'ACTIONS',
  Tutorial = 'TUTORIAL',
}

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
