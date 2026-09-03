import { useForm, type SubmitHandler } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardUserSchema, type OnboardUser } from '../schema/auth.schema';
import PageLoader from '../components/loaders/PageLoader';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { onboard } from '../api/auth.api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { CameraIcon, ShuffleIcon } from 'lucide-react';

const OnboardingPage = () => {
  const {user} = useAuth();

  const {
    register,
    handleSubmit,
    formState,
    getValues,
    watch
  } = useForm({
    resolver: zodResolver(onboardUserSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      nativeLanguage: user?.nativeLanguage || '',
      learningLanguage: user?.learningLanguage || '',
      location: user?.location || '',
      profilePic: null
    }
  });

  const [selectedProfilePic, setSelectedProfilePic] = useState<File | null>(null);

  const queryClient = new QueryClient();
  const {mutate: onboardUser, isPending, error} = useMutation({
    mutationFn: onboard,
    onSuccess: () => {
      toast.success('Profile onboarded successfully');
      queryClient.invalidateQueries({queryKey: ['authUser']});
    }
  });

  const handleOnboard: SubmitHandler<OnboardUser> = (data) => {
    onboardUser(data);
  }

  if(isPending) return <PageLoader />

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-5 sm:p-7'>
          <h1 className='text-xl sm:text-2xl md:text-3xl fond-bold text-center mb-4.5'>
            Complete your profile
          </h1>
          <form onSubmit={handleSubmit(handleOnboard)} method='post'>
            {/* Profile Pic section */}
            <div className='flex flex-col items-center justify-center space-y-3.5'>
              {/* Image preview */}
              <div className='flex items-center justify-center h-full'>
                {user?.profilePic || selectedProfilePic ? (
                  <img
                    src={user?.profilePic || URL.createObjectURL(selectedProfilePic!)}
                    alt={user?.fullName}
                    className='w-28 h-28 rounded-full object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <CameraIcon className='size-10 text-base-content opacity-40'/>
                  </div>
                )}
              </div>
              
              {/* Random Avatar button */}
              <div className='flex items-center gap-2'>
                <button type="submit" className='btn btn-accent'>
                  <ShuffleIcon className='size-3.5 mr-2'/>
                  Generate Random Avatar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage