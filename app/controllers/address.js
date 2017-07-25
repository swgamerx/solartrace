import Ember from "ember";
import RSVP from "rsvp";

export default Ember.Controller.extend({
  business: null,
  address: null,
  traces: Ember.computed(function() {
    var traceArray = Ember.A([]);
    var promise = new RSVP.promise(function(resolve, reject) {
      let address = this.get("model");
      address.get("traces").then(traces => {
        var total = traces.get("length");
        var count = 0;
        traces.map(trace => {
          trace.get("pins").then(pins => {
            let location = pins.map(pin => ({
              lat: pin.get("lat"),
              lng: pin.get("lng")
            }));
            traceArray.pushObject(location);
            count++;
            if (count >= total) {
              resolve(traceArray);
            }
          });
        });
      });
    });

    return promise.then(function(traces) {
      return traces;
    });
  }),
  pins: Ember.A([]),
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
      let pins = this.get("pins").map(pin =>
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
