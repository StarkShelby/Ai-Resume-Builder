const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,  // ALWAYS required to avoid duplicate users
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.githubId;
      },
      // Password is required ONLY for normal signup
    },

    googleId: {
      type: String,
      default: null,
      sparse: true,
    },

    githubId: {
      type: String,
      default: null,
      sparse: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ------------------ PASSWORD HASHING ------------------ */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

/* ------------------ PASSWORD CHECK ------------------ */
userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false; // OAuth users don't have passwords
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
