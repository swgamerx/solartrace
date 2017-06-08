import Ember from 'ember';

export default Ember.Controller.extend({
    lat: null,
    lng: null,
    actions: {
        addAddress(model){
            let business = this.get('model');
            // Create the address record
            // query google's map api for the address
            let address = this.get('address') + ', ' + this.get('city') + ' ' + $('select[name="state"]').val() + ' ' + this.get('zipcode');
            // set the properties based on what google found
            this.setProperties({
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng,
            });
            // check to see if a record for this address exists already
            let newAddress = this.get('store').createRecord('address', {
                    address1: this.get('address'),
                    city: this.get('city'),
                    state: $('select[name="state"]').val(),
                    zip: this.get('zipcode'),
                    business: model,
                    lat: this.get('lat'),
                    lng: this.get('lng'),
                    hex: stringToHex(address)
            });
            // Save the address
            newAddress.save().then((address) => {
                // add the address to the business
                business.get('addresses').addObject(address);
                // save the business
                business.save().then(() => {
                    // go to the next step to start tracing
                    this.transitionToRoute('trace.business.address.draw', address);
                });
            });
        }
    }
});
