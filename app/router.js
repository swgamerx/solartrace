import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('trace', function() {
    this.route('business', { path: '/:id' },function() {
      this.route('address', { path: '/:id' }, function() {
        this.route('draw');
      });
    });
  });
  this.route('admin', function() {
    this.route('businesses');
  });
});

export default Router;
