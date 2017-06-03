import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
    model() {
        return RSVP.hash({
            businesses: this.get('store').findAll('business'),
        });
    }
});
