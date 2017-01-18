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
    locationSet: false,
    googleMapAddress: null,
    actions: {
        // Find the address the user submitted
        findAddress: function(){
            let controller = this; 
            console.log('find address');
            let address = this.get('address') + ' ' + this.get('city') + ' ' + this.get('state');
            $.ajax('http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false').done(function(data){
                console.log(data.results[0]);
                controller.set('googleMapAddress', data.results[0]);
                controller.set('lat',data.results[0].geometry.location.lat);
                controller.set('lng',data.results[0].geometry.location.lng);
                controller.set('zoom',15);
                controller.set('locationSet',true);
            });
        },
        // Add a trace point to the map
        addPoint: function(e){
            console.log(e);
            let location = e.latlng;
            this.get('groundPoints').pushObject({
                lat: location.lat,
                lng: location.lng
            });
        },
        // User has moved around the map
        updateLocation(r, e) {
            let location = e.target.getLatLng();
            Ember.setProperties(r, {
                lat: location.lat,
                lng: location.lng
            });
        },
        // Save a trace with all it's points and apply it to the business and address
        submitTrace(){
            let address = Ember.store.createRecord('address', {
                company: this.get('company'),
                address1: this.get(googleMapAddress.address_components[0].long_name) + ' ' + this.get(googleMapAddress.address_components[1].long_name),
                address2: '',
                city: this.get(googleMapAddress.address_components[3].long_name),
                state: this.get(googleMapAddress.address_components[5].short_name),
                zipcode: this.get(googleMapAddress.address_components[7].long_name),
                longitude: this.get(googleMapAddress.geometry.location.lng),
                latitude: this.get(googleMapAddress.geometry.location.lat),
                addedDate: new Date()
            });
            let trace = Ember.store.createRecord('trace', {
                company: this.get('company'),
                address: address, 
                createdDate: new Date(),
                active: 1
            });
        }
    }
});
