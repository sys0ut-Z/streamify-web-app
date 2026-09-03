import { useForm, type SubmitHandler } from 'react-hook-form';
import { loginSchema, type LoginRequest } from '../schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/auth.api';
import { Label } from '../util/Label';
import { Input } from '../util/Input';
import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';

const LoginPage = () => {
  const { 
    register, 
    handleSubmit,
    formState,
    getValues,
    watch
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const queryClient = useQueryClient();

  const {mutate: loginUser, isPending, error} = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['authUser']}),
    /* 
      - You perform signup/login, and the server-side auth state changes
      - But TanStack Query doesn't automatically know that ["authUser"] is now potentially stale
      - If that query is currently being used by a component, TanStack Query will generally REFETCH it in the background
    */
  });

  const handleLogin: SubmitHandler<LoginRequest> = (data) => {
    loginUser(data);
  }

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
        <form onSubmit={handleSubmit(handleLogin)} method="post">
          <div className='space-y-4'>
            <div className='mb-3'>
              <h2 className='text-xl font-semibold'>Login to your account</h2>
              <p>Join Streamify and start your language learning adventure!</p>
            </div>

            <div className='space-y-3 mt-3'>

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

              <button className="btn btn-primary w-full" type="submit">
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <Link to="/auth/signup" className="text-primary hover:underline">
                    Create one
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

export default LoginPage