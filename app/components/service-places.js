import Ember from "ember";

export default Ember.Component.extend({
  business: null,
  lat: 0,
  lng: 0,
  zoom: 12,
  mapPoints: [],
  didInsertElement() {
    var def = $.Deferred();
    var location;
    navigator.geolocation.getCurrentPosition(position => {
      this.set("lat", position.coords.latitude);
      this.set("lng", position.coords.longitude);
      location = { lat: this.get("lat"), lng: this.get("lng") };
      def.resolve();
    });
    $.when(def).done(() => {
      let businessName = this.get("business").get("name");
      let lat = this.get("lat");
      let lng = this.get("lng");
      var map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng },
        zoom: 10
      });
      var service = new google.maps.places.PlacesService(map);

      let callback = (results, status) => {
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
  }
});
