import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  // User Registration
  this.route('register');

  // User Login
  this.route('login');

  // List of companies that people have added traces to 
  this.route('companies');

  // View for a specific company and all of it's traces
  this.route('company');

  // Add a trace, includes finding a business location to add the trace to
  this.route('trace');
  this.route('about');
});

export default Router;
