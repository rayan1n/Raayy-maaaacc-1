
export enum MacroAction {
  AUTO_EDIT = 'AUTO_EDIT',
  QUICK_RESET = 'QUICK_RESET',
  NONE = 'NONE'
}

export interface ControllerMapping {
  editButton: number;         // الزر الذي يبدأ عملية التحرير
  resetButton: number;        // الزر الذي يقوم بالريستارت الفوري
  selectButton: number;       // زر التحديد داخل اللعبة (عادة R2/RT)
  fortniteResetButton: number; // زر الريستارت داخل اللعبة (عادة R3/Right Stick)
  confirmDelay: number;       // التأخير بالملي ثانية
}

export interface GamepadState {
  connected: boolean;
  id: string | null;
  buttons: boolean[];
  axes: number[];
}
