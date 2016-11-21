import Ember from 'ember';

export default Ember.Controller.extend({
    lat: 36.174465,
    lng: -86.767960,
    zoom: 10,
    groundPoints: Ember.A([]),
    roofPoints: Ember.A([]),
    groundZone: Ember.computed('groundPoints.@each.lat', 'groundPoints.@each.lng', function(){
        return this.get('groundPoints').map(r => ({lat: r.lat, lng: r.lng}));
    }),
    actions: {
        findAddress: function(){
            let controller = this;
            let address = this.get('address') + ' ' + this.get('city') + ' ' + this.get('state');
            $.ajax('http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false').done(function(data){
                console.log(data);
                controller.set('lat',data.results[0].geometry.location.lat);
                controller.set('lng',data.results[0].geometry.location.lng);
                controller.set('zoom',15);
                console.log(controller.get('lat'));
                console.log(controller.get('lng'));
            });
        },
        addPoint: function(e){
            console.log(e);
            let location = e.latlng;
            this.get('groundPoints').pushObject({
                lat: location.lat,
                lng: location.lng
            });
        },
        updateLocation(r, e) {
            let location = e.target.getLatLng();
            Ember.setProperties(r, {
                lat: location.lat,
                lng: location.lng
            });
        }
    }
});
