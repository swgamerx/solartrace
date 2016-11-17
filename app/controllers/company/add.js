import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        addCompany: function(){
            let newCompany = this.store.createRecord('company', {
                name: this.get('name'),
                addedDate: new Date(),
                lastUpdated: new Date(),
            });
            newCompany.save();
        }
    }
});
