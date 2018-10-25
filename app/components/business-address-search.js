import Component from "@ember/component";
import { inject as service } from "@ember/service";
import RSVP from "rsvp";
import { get, set } from "@ember/object";

export default Component.extend({
  init() {
    this._super();
    this.addresses = [];
  },
  business: null,
  lat: 0,
  lng: 0,
  zoom: 12,
  geolocation: service(),
  didInsertElement() {
    let location;
    let promise = new RSVP.Promise(resolve => {
      get(this, "geolocation")
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
          rObj["lat"] = place.geometry.location.lat();
          rObj["lng"] = place.geometry.location.lng();
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
        set(this, "addresses", places);
      };
      service.textSearch(
        {
          location: location,
          query: [businessName]
        },
        callback
      );
    });
  }
});
