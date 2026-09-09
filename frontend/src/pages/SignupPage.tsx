import { ShipWheelIcon } from 'lucide-react';
import { signupSchema, type SignupRequest } from '../schema/auth.schema';
import {useForm, type SubmitHandler} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '../util/Label';
import { Input } from '../util/Input';
import { Link } from 'react-router';
import useSignup from '../hooks/useSignup';

const SignupPage = () => {
  const { 
    register, 
    handleSubmit,
    formState: {errors},
  } = useForm<SignupRequest>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  });

  const {signupUser, isPending, error} = useSignup();

  const handleSignup: SubmitHandler<SignupRequest> = (data) => {
    // console.log(data);
    signupUser(data);
  }

  // console.log(getValues());
  // console.log(watch());

  return (
    <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col justify-center'>
      <div className='mb-4 flex items-center justify-start gap-2'>
        <ShipWheelIcon className='size-9 text-primary'/>
        <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider'>
          Streamify
        </span>
      </div>

      {error && <div className='alert alert-error'>{error.message}</div>}

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
                {errors.fullName && (
                  <p className='text-error text-xs sm:text-sm'>{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className='form-control w-full space-y-1 lg:space-y-1.5'>
                <Label label='Email'/>
                <Input 
                  type="email"
                  placeholder='janedoe@gmail.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-error text-xs sm:text-sm'>{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className='form-control w-full space-y-1 lg:space-y-1.5'>
                <Label label='Password'/>
                <Input 
                  type="password"
                  placeholder='********'
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-error text-xs sm:text-sm'>{errors.password.message}</p>
                )}
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

              <button className="btn btn-primary w-full" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/auth/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage;