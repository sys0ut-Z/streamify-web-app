import { ShipWheelIcon } from 'lucide-react';
import { signupSchema, type SignupRequest } from '../schema/auth.schema';
import {useForm, type SubmitHandler} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../api/auth.service';

const SignupPage = () => {
  const { 
    register, 
    handleSubmit,
    formState,
    getValues,
    watch
  } = useForm<SignupRequest>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  });

  const queryClient = useQueryClient();

  const {mutate: signupUser, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['authUser']}),
    /* 
      - You perform signup/login, and the server-side auth state changes
      - But TanStack Query doesn't automatically know that ["authUser"] is now potentially stale
      - If that query is currently being used by a component, TanStack Query will generally REFETCH it in the background
    */
    onError: (error) => console.error(error)
  });

  const handleSignup: SubmitHandler<SignupRequest> = (data) => {
    console.log(data);
    signupUser(data);
  }

  // console.log(getValues());
  // console.log(watch());

  if(error){
    return (
      <div>
        Error signing up: {error.message}
      </div>
    )
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Form */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center'>
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className='size-9 text-primary'/>
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider'>
              Streamify
            </span>
          </div>
          <div className='w-full'>
            <form onSubmit={handleSubmit(handleSignup)} method="post">
              <div className='space-y-4'>
                <div className='mb-3'>
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p>Join Streamify and start your language learning adventure!</p>
                </div>

                <div className='space-y-3 mt-3'>
                  {/* Full Name */}
                  <div className='form-control w-full space-y-1 lg:space-y-1.5'>
                    <Label label='Full Name'/>
                    <Input 
                      type="text"
                      placeholder='Jane Doe'
                      {...register('fullName')}
                    />
                  </div>

                  {/* Email */}
                  <div className='form-control w-full space-y-1 lg:space-y-1.5'>
                    <Label label='Email'/>
                    <Input 
                      type="email"
                      placeholder='janedoe@gmail.com'
                      {...register('email')}
                    />
                  </div>

                  {/* Password */}
                  <div className='form-control w-full space-y-1 lg:space-y-1.5'>
                    <Label label='Password'/>
                    <Input 
                      type="password"
                      placeholder='********'
                      {...register('password')}
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">terms of service</span> and{" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>

                  <button className="btn btn-primary w-full" type="submit">
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Loading...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>


        {/* Image */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/video_call_phone.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage;

type LabelProps = {
  label: string;
}
const Label = ({label}: LabelProps) => (
  <label className='label'>
    <span className='label-text'>{label}</span>
  </label>
)


// ! if you only pass placeholder & type then other properties of 'input' element will not be passed
// ! hence, 'ref' will not be passed which is necessary for rhf
type InputProps = React.ComponentProps<'input'>;
const Input = (props: InputProps) => (
  <input
    {...props}
    className='input input-bordered w-full'
    // required
  />
)