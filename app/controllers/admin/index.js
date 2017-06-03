import Ember from 'ember';

export default Ember.Controller.extend({
    showBusinessForm: false,
    actions: {
        addBusinessForm(){
            this.set('showBusinessForm',true);
        }
    }
});
