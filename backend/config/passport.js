const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_CLIENT_SECRET",
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with same email
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Link accounts
                    user.googleId = profile.id;
                    await user.save();
                    return done(null, user);
                }

                // Create new user
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                });

                await user.save();
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
            scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let email = null;

                // GitHub may not return email – fetch manually
                if (profile.emails && profile.emails.length > 0) {
                    email = profile.emails[0].value;
                }

                // Check by githubId
                let user = await User.findOne({ githubId: profile.id });

                if (user) return done(null, user);

                // Check by email if available
                if (email) {
                    user = await User.findOne({ email });

                    if (user) {
                        user.githubId = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                }

                // Create user even without email (but store placeholder)
                user = new User({
                    name: profile.displayName || profile.username,
                    email: email,
                    githubId: profile.id,
                });

                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

module.exports = passport;
