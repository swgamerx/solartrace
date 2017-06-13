import Ember from "ember";

export default Ember.Route.extend({
  model(params) {
      return this.get('store').findRecord('business', params.business_id);
  },
  setupController(controller, model) {
    navigator.geolocation.getCurrentPosition(position => {
      controller.set("lat", position.coords.latitude);
      controller.set("lng", position.coords.longitude);
    });
  }
});
