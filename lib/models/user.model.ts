import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "prefer not to say"],
    default: "prefer not to say",
  },
  education: {
    level: {
      type: String,
      enum: ["high school", "bachelor", "master", "phd", "other"],
      default: "other",
    },
    field: String,
    institution: String,
  },
  location: {
    state: String,
    country: String,
  },
  bio: {
    type: String,
    maxLength: 500,
  },
  phoneNumber: String,
  dateOfBirth: Date,
  interests: [String],
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
  },
  learningGoals: [String],
  preferredLanguages: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

userSchema.pre("save", function(next) {
  this.updatedAt = new Date()
  next()
})

export const User = mongoose.models.User || mongoose.model("User", userSchema) 