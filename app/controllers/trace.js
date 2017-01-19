import Ember from 'ember';
import RSVP from 'rsvp';

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
                console.log(controller.get('googleMapAddress'));
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
        saveTrace(){
            let location = this.get('googleMapAddress');
            let address = this.store.createRecord('address', {
                company: this.get('company'),
                address1: location.address_components[0].long_name + ' ' + location.address_components[1].long_name,
                address2: '',
                city: location.address_components[3].long_name,
                state: location.address_components[5].short_name,
                zipcode: location.address_components[7].long_name,
                longitude: location.geometry.location.lng,
                latitude: location.geometry.location.lat,
                addedDate: new Date()
            });
            

            let pins = this
            .get('groundPoints')
            .map(groundPoint => this.store.createRecord('pin', {
                latitude: groundPoint.lat,
                longitude: groundPoint.lng
            }));

            RSVP.all(pins.invoke('save')).then((pins) => {
                let trace = this.store.createRecord('trace', {
                    company: this.get('company'),
                    address: address, 
                    createdDate: new Date(),
                    active: 1,
                    pins: pins
                });
                trace.save();
                address.save();
            });
        }
    }// end actions 
});
