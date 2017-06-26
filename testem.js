/*jshint node:true*/
module.exports = {
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "launch_in_ci": [
    "Chrome"
  ],
  "browser_args": {
      'Chrome': [ '--headless', '--disable-gpu', '--remote-debugging-port=992'],
  },
  "launch_in_dev": [
    "Chrome"
  ]
};
