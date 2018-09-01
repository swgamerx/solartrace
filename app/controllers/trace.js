import Controller from "@ember/controller";
import Ember from "ember";
import { computed, get, setProperties, set } from "@ember/object";
import store from "ember-data/store";
import { schedule } from "@ember/runloop";

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
  business: null,
  lat: 0, // latitude map position
  lng: 0, // longitude map position
  zoom: 10, // map zoom level
  selectedAddress: null, // address selected to trace
  // IF a address is selected, used for determining what to show
  hasSelectedAddress: computed("selectedAddress", function() {
    return selectedAddress ? true : false;
  }),
  showAddresses: false,
  businessAddresses: computed("model.business", "lat", "lng", function() {
    // if there is a busines then lets find locations
    let businessName = get(this, "model.business.name");
    let lat = get(this, "lat");
    let lng = get(this, "lng");
    schedule("afterRender", () => {
      if (lat != 0 && lng != 0) {
        let location = new google.maps.LatLng(lat, lng);
        var map = new google.maps.Map(document.getElementById("map"), {
          center: location,
          zoom: 10
        });
        var service = new google.maps.places.PlacesService(map);
        service.textSearch(
          {
            location: location,
            query: [businessName]
          },
          callback
        );
      }
    });
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
      set(this, "showAddresses", true);
      set(this, "businessAddresses", places);
    };
  }),
  pins: [],
  groundZone: [],
  mapPoints: [], // points of trace
  geolocation: Ember.inject.service(), // geolocation to find user's position
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
