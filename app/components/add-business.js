import Ember from 'ember';

export default Ember.Component.extend({
    firebaseUtil: Ember.inject.service('firebaseUtil'),
    store: Ember.inject.service(),
    actions: {
        addBusiness: function(){
            let file = $('input[name="logo"]')[0].files[0];
            let shortName = this.get('name').toLowerCase().replace(/-/g,'_');
            this.get('firebaseUtil').uploadFile('images/businesses/'+shortName+'.png', file).then(downloadUrl => {
                var newBusiness = this.get('store').createRecord('business', {
                    name: this.get('name'),
                    logo: downloadUrl,
                    description: this.get('description'),
                    dateAdded: new Date()
                });
                newBusiness.save();
            }).catch(error => {

            });
        }
    }
});
