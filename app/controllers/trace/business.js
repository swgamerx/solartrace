import Ember from 'ember';

export default Ember.Controller.extend({
    lat: 0,
    lng: 0,
    zoom: 10,
    selectedAddress: null,
    mapPoints: [],
    actions: {
        findPlaces(){

        },
        addAddress(model){
        }
    }
});
