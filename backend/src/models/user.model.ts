import mongoose, { InferSchemaType, Model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Pls enter your full name"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },
  bio: {
    type: String,
    default: ""
  },
  profilePic: {
    type: String,
    default: ""
  },
  nativeLanguage: {
    type: String,
    default: ""
  },
  learningLanguage: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  // when user tries to open chat and if it has not entered details, user will be asked to fill the details first
  isOnboarded: {
    type: Boolean,
    default: false
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, {timestamps: true});

userSchema.pre("save", async function(){
  // has this field been changed since this document was created
  if(!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } 
  catch (error) {
    throw error;
  }
})

userSchema.methods.matchPassword = async function(enteredPass: string){
  return (await bcrypt.compare(enteredPass, this.password));
}

interface UserMethods {
  matchPassword(enteredPass: string): Promise<boolean>;
}

export type User = InferSchemaType<typeof userSchema>;
const UserModel = mongoose.model<User, Model<User, {}, UserMethods>>("User", userSchema); // it will give/return 'Model<User>'

export default UserModel;