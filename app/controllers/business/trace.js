import Controller from '@ember/controller';

export default Controller.extend({
    lat: 0,
  lng: 0,
  zoom: 10,
  selectedAddress: null,
  mapPoints: [],
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
            this.transitionToRoute("address", addresses.get('firstObject'));
          } else {
            // there is no record found
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
                this.transitionToRoute("address", address);
              });
            });
          }
        });
    } // end selectLocation
}
});
