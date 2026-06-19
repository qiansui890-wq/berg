export interface StepperStep {
  label: string;
  /** Optional sub-label under the step. */
  sub?: string;
}
export interface StepperProps {
  /** Step labels (strings) or { label, sub } objects. */
  steps?: (string | StepperStep)[];
  /** 0-based index of the active step; earlier steps render as completed. */
  current?: number;
}
/** Horizontal progress through case stages (Intake → … → Recovered). */
export function Stepper(props: StepperProps): JSX.Element;
