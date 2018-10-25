import Controller from "@ember/controller";
//import Ember from "ember";
import { computed, get, setProperties /*, set */ } from "@ember/object";
import RSVP from "rsvp";
import { inject as service } from "@ember/service";

export default Controller.extend({
  init() {
    this._super();
    // Get the user's geolocation and set the lat and lng properties
    get(this, "geolocation")
      .getLocation()
      .then(position => {
        setProperties(this, {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    this.pins = [];
    this.groundZone = [];
    this.mapPoints = []; // points of trace
  },
  geolocation: service(),
  queryParams: ["business", "address"],
  business: null, // business id
  lat: 0, // latitude map position
  lng: 0, // longitude map position
  zoom: 10, // map zoom level
  selectedAddress: null, // address selected to trace
  // IF a address is selected, used for determining what to show
  hasSelectedAddress: computed("selectedAddress", function() {
    return get(this, "selectedAddress") ? true : false;
  }),
  showAddresses: true, // should addresses show, toggled when businesses are found
  actions: {
    selectLocation(address) {
      console.log(address.lat);
      console.log(address.lng);
      this.setProperties({
        showAddresses: false,
        zoom: 18,
        lat: address.lat,
        lng: address.lng
      });
      let business = get(this, "model.business");
      let newAddress = this.get("store").createRecord("address", {
        address1: address.address1,
        city: address.city,
        state: address.state,
        zipcode: address.zipcode,
        business: business,
        lat: address.lat,
        lng: address.lng,
        placeId: address.placeId,
        country: address.country
      });
      newAddress.save().then(address => {
        business.get("addresses").pushObject(address);
        business.save().then(() => {});
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
      setProperties(this, r, {
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
