import Ember from "ember";
import RSVP from "rsvp";

export default Ember.Controller.extend({
  business: null,
  address: null,

  // existing traces
  traces: Ember.computed("model.traces.[]", function() {
    // get the traces
    return this.get("model.traces").then(trace => {
      return trace.map(trace => {
        return trace.get("pins").then(pins => {
          return pins.map(pin => {
            return {
              lat: pin.get("lat"),
              lng: pin.get("lng")
            };
          });
        });
      });
    });
  }),

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
        let trace = this.store.createRecord("trace", {
          pins: pins
        });
        trace.save().then(trace => {
          address.get("traces").pushObject(trace);
          address.save();
        });
      });
    }
  }
});
