export type LabelProps = {
  label: string;
}

export const Label = ({label}: LabelProps) => (
  <label className='label'>
    <span className='label-text'>{label}</span>
  </label>
);