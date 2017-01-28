import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Controller.extend({
    lat: 36.174465,
    lng: -86.767960,
    zoom: 14,
    groundPoints: Ember.A([]),
    roofPoints: Ember.A([]),
    groundZone: Ember.computed('groundPoints.@each.lat', 'groundPoints.@each.lng', function(){
        return this.get('groundPoints').map(r => ({lat: r.lat, lng: r.lng}));
    }),
    locationSet: false,
    googleMapAddress: null,
    ajax: Ember.inject.service(),
    actions: {
        // Find the address the user submitted
        findAddress: function(){
            let ajax = this.get('ajax');
            console.log('find address');
            let address = this.get('address') + ' ' + this.get('city') + ' ' + this.get('state');
            ajax.request('http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false').then(data => {
                console.log(data);
                this.setProperties({
                    googleMapAddress: data.results[0],
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng,
                  //  zoom: 15, // for some reason changing zoom prevents the map changing position
                    locationSet: true
                });
                console.log(this.get('lat'));
                console.log(this.get('lng'));
            });
        },
        // Add a trace point to the map
        addPoint: function(e){
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
            let company = this.store.peekRecord('company',$('select[name="company"]').val());
            let location = this.get('googleMapAddress');
            let address = this.store.createRecord('address', {
                company: company,
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
            let positions = [];
            let groundPoints = this.get('groundPoints');
            for(let i = 0; i < groundPoints.length; i++){
                positions.push([groundPoints[i].lat,groundPoints[i].lng]);
            }
            var polygon = {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [positions]
                    }
                    }]
                };

            var squareMeters = turf.area(polygon);
            console.log(squareMeters);
            RSVP.all(pins.invoke('save')).then((pins) => {
                let trace = this.store.createRecord('trace', {
                    company: company,
                    address: address, 
                    createdDate: new Date(),
                    active: 1,
                    pins: pins,
                    squareMeters: squareMeters
                });
                trace.save();
                address.save();
            });
        }
    }// end actions 
});
