import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
    model(params){
        return RSVP.hash({
            company: this.get('store').findRecord('company',params.id),
            addresses: this.get('store').query('address',{
                orderBy: 'company',
                equalTo: params.id,
                limitToFirst: 100
            })
        });
    }
});
