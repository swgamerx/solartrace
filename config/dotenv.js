// config/dotenv.js
module.exports = function(env) {
    return {
      clientAllowedKeys: ['FIREBASE_KEY','GOOGLE_KEY'],
      // Fail build when there is missing any of clientAllowedKeys environment variables.
      // By default false.
      failOnMissingKey: false, 
    };
  };