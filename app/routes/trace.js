import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
    model(){
        return RSVP.hash({
            companies: this.store.findAll('company'),
            types: this.store.findAll('type')
        });
    }
});
