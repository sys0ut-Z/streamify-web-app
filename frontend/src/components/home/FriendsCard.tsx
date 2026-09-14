import { Link } from 'react-router'
import type { FriendRequestUser } from '../../types/user.types'
import { LANGUAGE_TO_FLAG } from '../../constants/constants'

interface FriendCardProps {
  friend: FriendRequestUser
}
const FriendCard = ({friend}: FriendCardProps) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
      <div className='card-body p-3'>

        {/* User Info */}
        <div className="flex items-center gap-2 lg:gap-3 mb-3">
          <div className="avatar size-11">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        {/* Languages section */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  )
}

export default FriendCard;

export function getLanguageFlag(language: string) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-2 lg:h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}