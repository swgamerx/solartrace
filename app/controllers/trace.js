import Controller from "@ember/controller";
import Ember from "ember";
import { computed, get, setProperties } from "@ember/object";

export default Controller.extend({
  init() {
    get(this, "geolocation")
      .getLocation()
      .then(position => {
        setProperties(this, {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
  },
  queryParams: ["business", "address"],
  lat: 0, // latitude map position
  lng: 0, // longitude map position
  zoom: 10, // map zoom level
  selectedAddress: null, // address selected to trace
  // IF a address is selected, used for determining what to show
  hasSelectedAddress: computed("selectedAddress", function() {
    return selectedAddress ? true : false;
  }),
  pins: [],
  groundZone: [],
  mapPoints: [], // points of trace
  geolocation: Ember.inject.service(), // geolocation to find user's position
  /**
   * Used by google maps for searching for businesses based on geolcation
   */
  didInsertElement() {
    var location;
    let promise = new RSVP.Promise(resolve => {
      this.get("geolocation")
        .getLocation()
        .then(position => {
          this.set("lat", position.coords.latitude);
          this.set("lng", position.coords.longitude);
          location = { lat: this.get("lat"), lng: this.get("lng") };
          resolve();
        });
    });
    promise.then(() => {
      let businessName = this.get("business").get("name");
      let lat = this.get("lat");
      let lng = this.get("lng");
      var map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng },
        zoom: 10
      });
      var service = new google.maps.places.PlacesService(map);

      let callback = results => {
        let places = results.map(function(place) {
          let rObj = {};
          rObj["lat"] = place.geometry.viewport.f.b;
          rObj["lng"] = place.geometry.viewport.b.b;
          rObj["placeId"] = place.place_id;
          rObj["address1"] = place.formatted_address.split(",")[0];
          rObj["city"] = place.formatted_address.split(",")[1];
          rObj["state"] = place.formatted_address
            .split(",")[2]
            .substring(1)
            .split(" ")[0];
          rObj["zipcode"] = place.formatted_address
            .split(",")[2]
            .substring(1)
            .split(" ")[1];
          rObj["country"] = place.formatted_address.split(",")[3];
          return rObj;
        });
        this.set("mapPoints", places);
      };
      service.textSearch(
        {
          location: location,
          query: [businessName]
        },
        callback
      );
    });
  },
  actions: {
    selectLocation(address) {
      this.get("store")
        .query("address", {
          orderBy: "placeId",
          equalTo: address.placeId,
          limitToLast: 1
        })
        .then(addresses => {
          var business = this.get("model");
          if (addresses.get("length") > 0) {
            // If there is already a record
            this.transitionToRoute("address", addresses.get("firstObject"));
          } else {
            // there is no record found
            let newAddress = this.get("store").createRecord("address", {
              address1: address.address1,
              city: address.city,
              state: address.state,
              zipcode: address.zipcode,
              business: business,
              lat: addresems.lat,
              lng: address.lng,
              placeId: address.placeId,
              country: address.country
            });
            newAddress.save().then(address => {
              business.get("addresses").pushObject(address);
              business.save().then(() => {
                this.transitionToRoute("address", address);
              });
            });
          }
        });
    }, // end selectLocation
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
