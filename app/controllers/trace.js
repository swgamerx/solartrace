import Ember from 'ember';

export default Ember.Controller.extend({
    lat: 36.174465,
    lng: -86.767960,
    zoom: 10,
    actions: {
        findAddress: function(){
            let controller = this;
            let address = this.get('address') + ' ' + this.get('city') + ' ' + this.get('state');
            $.ajax('http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false').done(function(data){
                console.log(data);
                controller.set('lat',data.results[0].geometry.location.lat);
                controller.set('lng',data.results[0].geometry.location.lng);
                controller.set('zoom',15);
            });
        }
    }
});
