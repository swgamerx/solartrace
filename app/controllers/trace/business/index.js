import Ember from 'ember';

export default Ember.Controller.extend({
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
              equalto: address.placeId,
              limitToLast: 10
            })
            .then((addresses) => {
                var business = this.get("model");
              if (addresses.get("length") > 0) {
                // If there is already a record
                business.get('addresses').pushObject(addresses[0]);
                this.transitionToRoute("trace.business.address", addresses[0]);
              } else {
                // there is no record found
                let newAddress = this.get("store")
                  .createRecord("address", {
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
                newAddress.save().then((address) => {
                    business.get('addresses').pushObject(address);
                    business.save().then(()=>{
                        this.transitionToRoute("trace.business.address", address);
                    });
                 });
              }
            });
        } // end selectLocation
    }
});
