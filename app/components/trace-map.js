import Ember from 'ember';

export default Ember.Component.extend({
    address: null,
    pins: Ember.A([]),
    groundZone: Ember.computed('pins.@each.lat', 'pins.@each.lng', function(){
        return this.get('pins').map(r => ({lat: r.lat, lng: r.lng}));
    })
});
