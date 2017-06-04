import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        addAddress(model){
            let business = this.get('model');
            // Create the address record
            let newAddress = this.get('store').createRecord('address', {
                    address1: this.get('address'),
                    city: this.get('city'),
                    state: $('select[name="state"]').val(),
                    zip: this.get('zipcode'),
                    business: model
            });
            // Save the address
            newAddress.save().then((address) => {
                // add the address to the business
                business.get('addresses').addObject(address);
                // save the business
                business.save().then(() => {
                    // go to the next step to start tracing 
                    this.transitionToRoute('trace.business.address', address);
                });
            });
        }
    }
});
