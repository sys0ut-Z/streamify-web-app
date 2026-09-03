// ! if you only pass placeholder & type then other properties of 'input' element will not be passed
// ! hence, 'ref' will not be passed which is necessary for rhf
export type InputProps = React.ComponentProps<'input'>;
export const Input = (props: InputProps) => (
  <input
    {...props}
    className='input input-bordered w-full'
    // required
  />
)