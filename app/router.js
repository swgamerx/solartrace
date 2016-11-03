import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('register');
  this.route('login');
  this.route('companies');
  this.route('company');
  this.route('trace');
});

export default Router;
