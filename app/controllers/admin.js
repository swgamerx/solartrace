import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        // add new trace type
        typeAdd: function(){
            let type = this.store.createRecord('type', {
                title: this.get('title'),
                description: this.get('description')
            });
            type.save();
            this.setProperties({
                title: '',
                description: ''
            });
        }
    }
});
