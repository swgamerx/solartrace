import Ember from "ember";
import RSVP from "rsvp";

export default Ember.Controller.extend({
  business: null,
  address: null,

  // existing traces


  // new pins
  pins: [],
  groundZone: Ember.computed("pins.@each.lat", "pins.@each.lng", function() {
    return this.get("pins").map(r => ({ lat: r.lat, lng: r.lng }));
  }),
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
    saveTrace: function() {
      const address = this.get("model");
      var pins = this.get("pins").map(pin =>
        this.store.createRecord("pin", {
          lat: pin.lat,
          lng: pin.lng
        })
      );
      RSVP.all(pins.invoke("save")).then(pins => {
        let areaPins = pins.map(function(pin){
          return [pin.get('lat'),pin.get('lng')];
        });
        areaPins.push(areaPins[0]);
        let polygon = turf.polygon([areaPins]);
        let area = turf.area(polygon);
        let trace = this.store.createRecord("trace", {
          pins: pins, 
          squareMeters: area
        });
        trace.save().then(trace => {
          address.get("traces").pushObject(trace);
          address.save();
        });
      });
    }
  }
});
