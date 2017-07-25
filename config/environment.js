/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'solartrace',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    firebase: {
      apiKey: 'AIzaSyBW0ksBWRxOyF5Mqp_OA4S-69JS92dg_Pw',
      authDomain: 'solartrace-51fa4.firebaseapp.com',
      databaseURL: 'https://solartrace-51fa4.firebaseio.com',
      storageBucket: 'solartrace-51fa4.appspot.com',
    },
    googleMutantLeaflet: {
        apiKey: 'AIzaSyDJ8Hl-47JJ7ZWV7jKw0JKT52cvVFkHGcQ',
        libraries: ['places'],
        include: false
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-cli-mirage'] = {
            enabled: false
    };
    ENV.contentSecurityPolicy = {
        'default-src': "'none'",
        'script-src': "'self' 'unsafe-eval' *.googleapis.com",
        'font-src': "'self' fonts.gstatic.com",
        'img-src': "'self' data: *.googleapis.com maps.gstatic.com *.gstatic.com",
        'style-src': "'self' 'unsafe-inline' *.googleapis.com"
    };
    ENV.MapQuestAPI = {
        key: '6GtBBp0SAGveAAbpGNbFOvL2VL88GGMe',
        map: 'true',        //default is 'true'
        geocoding: 'false',  //default is 'false'
        routing: 'false',    //default is 'false'
        traffic: 'false',     //default is 'false'
        version: '2.2'      //default is '2.2', this is the MapQuest API version number to use.
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV['polyfill-io'] = {
      features: ['navigator.geolocation']
    };

    ENV['ember-cli-mirage'] = {
            enabled: true
    };
} // end test environment

  if (environment === 'production') {

  }

  return ENV;
};
