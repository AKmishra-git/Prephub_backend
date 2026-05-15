require("dotenv").config()
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const userModel = require("../models/auth.model")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userModel.findOne({ googleId: profile.id })

      if (!user) {
        user = await userModel.findOne({ email: profile.emails[0].value })
        if (user) {
          user.googleId = profile.id
          await user.save()
        } else {
          user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: null
          })
        }
      }

      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }
))

module.exports = passport