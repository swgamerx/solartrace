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
  this.route('company', function() {
    this.route('add');
  });

  // Add a trace, includes finding a business location to add the trace to
  this.route('trace');

  // about page
  this.route('about');

  // Admin page
  this.route('admin', function() {
    this.route('company', {path: '/company/:id'});
  });
});

export default Router;
