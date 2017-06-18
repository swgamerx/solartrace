import Ember from 'ember';

export default Ember.Controller.extend({
    lat: 0,
    lng: 0,
    zoom: 10,
    selectedAddress: null,
    mapPoints: [],
    // actions: {
    //     selectLocation(model){
    //         let address = this.get('store').query('address', {
    //             orderBy: 'placeId',
    //             equalto: model.placeId,
    //             limitToLast: 10
    //         }).then((addresses) => {
    //             console.log(addresses);
    //         });
    //     }
    // }
});
