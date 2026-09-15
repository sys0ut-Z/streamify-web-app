import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardUserSchema, type OnboardUser } from '../schema/auth.schema';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { onboard } from '../api/auth.api';
import toast, { LoaderIcon } from 'react-hot-toast';
import { CameraIcon, MapPinIcon, RotateCcw, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { Label } from '../util/Label';
import { Input } from '../util/Input';
import { LANGUAGES } from '../constants/constants';

const OnboardingPage = () => {
  const {user} = useAuth();

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
    control
  } = useForm({
    resolver: zodResolver(onboardUserSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      nativeLanguage: user?.nativeLanguage || '',
      learningLanguage: user?.learningLanguage || '',
      location: user?.location || '',
      profilePic: user?.profilePic || ''
    }
  });

  const queryClient = useQueryClient();
  const {mutate: onboardUser, isPending, error} = useMutation({
    mutationFn: onboard,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['authUser']});
      toast.success('Profile onboarded successfully');
    }
  });

  const profilePicPreview = useWatch({
    control,
    name: 'profilePic'
  })

  const generateRandomAvatar = () => {
    const randomInt = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://api.dicebear.com/10.x/adventurer-neutral/png?seed=user-${randomInt}`;
    setValue('profilePic', randomAvatar, {shouldDirty: true});
  }

  const handleOnboard: SubmitHandler<OnboardUser> = (data) => {
    onboardUser(data);
  }

  // if(isPending) return <PageLoader />

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-5 sm:p-7'>
          <h1 className='text-xl sm:text-2xl md:text-3xl fond-bold text-center mb-4.5'>
            Complete your profile
          </h1>
          <form onSubmit={handleSubmit(handleOnboard)} method='post' className='space-y-5'>
            {/* Profile Pic section */}
            <div className='flex flex-col items-center justify-center space-y-3.5'>
              {/* Image preview */}
              <div className='flex items-center justify-center h-full'>
                {profilePicPreview ? (
                  <img
                    // & dirtyFields is boolean array of the fields that have been modified
                    src={profilePicPreview}
                    alt={user?.fullName || 'User Avatar'}
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
                <button type="button" className='btn btn-accent'
                  onClick={generateRandomAvatar}
                >
                  <ShuffleIcon className='size-3.5 mr-2'/>
                  Generate Random Avatar
                </button>
                <button type="button" className='btn btn-accent'
                  onClick={() => setValue('profilePic', user?.profilePic || '', {shouldDirty: true})}
                >
                  <RotateCcw className='size-3.5 mr-2'/>
                  Reset Avatar
                </button>
              </div>
            </div>

            {error && <div className='alert alert-error'>{error.message}</div>}

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
            
            {/* Bio */}
            <div className="form-control">
              <Label label='Bio'/>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Tell others about yourself and your language learning goals"
                {...register('bio')}
              />
              {errors.bio && (
                <p className='text-error text-xs sm:text-sm'>{errors.bio.message}</p>
              )}
            </div>

            {/* Languages */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Native language */}
              <div className='form-control space-y-1 lg:space-y-1.5'>
                <Label label='Native Language'/>
                <LanguageDropdown {...register('nativeLanguage')} langType="native"/>
                {errors.nativeLanguage && (
                  <p className='text-error text-xs sm:text-sm'>{errors.nativeLanguage.message}</p>
                )}
              </div>

              {/* Learning Language */}
              <div className='form-control space-y-1 lg:space-y-1.5'>
                <Label label='Learning Language'/>
                <LanguageDropdown {...register('learningLanguage')} langType="learning" />
                {errors.learningLanguage && (
                  <p className='text-error text-xs sm:text-sm'>{errors.learningLanguage.message}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className='form-control space-y-1 lg:space-y-1.5'>
              <Label label='Location'/>
              <div className='relative'>
                <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-75'/>
                <Input 
                  type="text"
                  placeholder='City, Country'
                  {...register('location')}
                />
                {errors.location && (
                  <p className='text-error text-xs sm:text-sm'>{errors.location.message}</p>
                )}
              </div>
            </div>

            {/* Submit button */}
            <button className='btn btn-primary w-full' type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderIcon className='animate-spin size-5 mr-2' />
                  Onboarding...
                </>
              ) : (
                <>
                  <ShipWheelIcon className='size-5 mr-2' />
                  Complete Onboarding
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage

type LanguageProps = React.ComponentPropsWithRef<'select'> & {langType: string}
const LanguageDropdown = ({langType: lt, ...props}: LanguageProps) => (
  <select
    className='select select-bordered w-full'
    {...props}
  >
    <option value="">Select your {lt} language</option>
    {LANGUAGES.map((lang) => (
      <option key={`${lt}-${lang}`} value={lang.toLowerCase()}>
        {lang}
      </option>
    ))}
  </select>
)