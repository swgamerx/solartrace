import Controller from "@ember/controller";
import Ember from "ember";
import { computed, get, setProperties, set } from "@ember/object";
import store from "ember-data/store";
import { schedule } from "@ember/runloop";

export default Controller.extend({
  init() {
    // Get the user's geolocation and set the lat and lng properties
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
  business: null, // business id
  lat: 0, // latitude map position
  lng: 0, // longitude map position
  zoom: 10, // map zoom level
  selectedAddress: null, // address selected to trace
  // IF a address is selected, used for determining what to show
  hasSelectedAddress: computed("selectedAddress", function() {
    return selectedAddress ? true : false;
  }),
  showAddresses: false, // should addresses show, toggled when businesses are found
  businessAddresses: computed("model.business", "lat", "lng", function() {
    // if there is a busines then lets find locations
    let businessName = get(this, "model.business.name"); // business name, used for search
    let lat = get(this, "lat"); // user's lat
    let lng = get(this, "lng"); // user's lng
    /**
     * Wait until leaflet has been rendered otherwise google maps functions will begin 
     * to fail due to the map container lacking a width & height as well as the geolocations
     * being unknown. If this is not functioning properly google will will report the error 
     * a is null
     * Which means it could not perform it's operations due to the map. 
     */
    schedule("afterRender", () => {
      if (lat != 0 && lng != 0) {
        let location = new google.maps.LatLng(lat, lng); // Google generated location 
        // Inform google which div is the map wrapper.
        var map = new google.maps.Map(document.getElementById("map"), {
          center: location,
          zoom: 10
        });
        // instantiate Places service to search
        var service = new google.maps.places.PlacesService(map);
        // Search Google Places for the selected business and location
        service.textSearch(
          {
            location: location,
            query: [businessName]
          },
          callback // callback to build map of all found locations
        );
      }
    });
    /**
     * Take the response from google and format it into a usable array 
     * @param {object} results 
     */
    let callback = results => {
      let places = results.map(function(place, index) {
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
        rObj['index'] = index;
        return rObj;
      });
      set(this, "showAddresses", true);
      set(this, "businessAddresses", places);
      console.log(get(this, 'businessAddresses'));
    };
  }),
  pins: [],
  groundZone: [],
  mapPoints: [], // points of trace
  geolocation: Ember.inject.service(), // geolocation to find user's position
  actions: {
    selectLocation(address) {
      console.log(address);
      this.setProperties({
        showAddresses: false, 
        zoom: 20,
        lat: address.lat, 
        lng: address.lng
      });
      let businessAddresses = get(this, 'businessAddresses');
      address = businessAddresses[address];
      console.log(address);
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
        business.save().then(() => {
         
        });
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
