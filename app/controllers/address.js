import Ember from "ember";
import RSVP from 'rsvp';

export default Ember.Controller.extend({
  business: null,
  address: null,
  traces: function(){
      
  },
  pins: Ember.A([]),
  actions: {
    addPin: function(e) {
      let location = e.latlng;
      this.get("pins").pushObject({
        lat: location.lat,
        lng: location.lng
      });
    },
    // User has moved around the map
        updatePinLocation(r, e) {
            let location = e.target.getLatLng();
            Ember.setProperties(r, {
                lat: location.lat,
                lng: location.lng
            });
        },
    saveTrace: function(){
        const address = this.get('model');
        let pins = this.get('pins').map(pin => this.store.createRecord('pin', {
            lat: pin.lat,
            lng: pin.lng
        }));
        RSVP.all(pins.invoke('save')).then((pins) => {
            let trace = this.store.createRecord('trace',{
                pins: pins
            });
            trace.save().then((trace) => {
                address.get('traces').pushObject(trace);
                address.save();
            });
        });
    }
  }
});
