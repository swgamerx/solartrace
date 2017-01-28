import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
    model(){
        return RSVP.hash({
            types: this.get('store').findAll('type'),
            panelLayouts: this.get('store').findAll('panelLayout'),
            panels: this.get('store').findAll('panel'),
            companies: this.get('store').findAll('company')
        });
    }
});
