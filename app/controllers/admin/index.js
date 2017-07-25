import Ember from 'ember';

export default Ember.Controller.extend({
    showBusinessForm: false,
    actions: {
        addBusinessForm(){
            this.set('showBusinessForm',true);
        },
        addTraceType(){
            let newType = this.get('store').createRecord('traceType', {
                name: this.get('name')
            });
            newType.save();
        }
    }
});
