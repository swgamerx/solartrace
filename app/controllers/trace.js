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
    company: null,
    newAddress: true,
    address: null,
    actions: {
        // Find the address the user submitted
        findAddress: function(){
            let ajax = this.get('ajax');
            let address = this.get('address') + ' ' + this.get('city') + ' ' + this.get('state');
            // query google's map api for the address
            ajax.request('http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false').then(data => {
                // set the properties based on what google found
                this.setProperties({
                    googleMapAddress: data.results[0],
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng,
                  //  zoom: 15,
                    locationSet: true
                });
                // check to see if a record for this address exists already
                this.store.findRecord('company',$('select[name="company"]').val(),{include: 'addresses'}).then((company) => {
                    console.log(company.get('addresses'));
                    var tempAddress = this.get('googleMapAddress').address_components[0].long_name + ' ' + this.get('googleMapAddress').address_components[1].long_name;
                    let addresses = company.get('addresses');
                    addresses.forEach(function(address){
                        this.store.peekRecord('address',address.id).then(function(address){
                            console.log(address.toString());
                        });
                       // console.log(address.toString());
                        //console.log(address.get('address1'));
                      //  console.log(address.address1 + ' = ' + tempAddress);
                        // if(address.address1 === tempAddress && this.get('newAddress')){
                        //     console.log('address already exists');
                        //     this.set('newAddress',false);
                        //     this.get('address',address);
                        // }
                    });
                });
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
            let traceType = this.store.peekRecord('type',$('select[name="type"]').val());
            let location = this.get('googleMapAddress');
            // if new address is required;
            console.log(this.get('newAddress'));
            let address = '';
            if(this.get('newAddress')){
                address = this.store.createRecord('address', {
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
            } else {
                address = this.get('address');
            }
            company.get('addresses').pushObject(address);
            
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
            // calculate the square meters of the trace
            var squareMeters = turf.area(polygon);

            // save the pins
            RSVP.all(pins.invoke('save')).then((pins) => {
                let trace = this.store.createRecord('trace', {
                    company: company,
                    address: address, 
                    createdDate: new Date(),
                    active: 1,
                    pins: pins,
                    squareMeters: squareMeters,
                    type: traceType
                });
                trace.save();
                if(this.get('newAddress')){
                    address.save();
                }
                company.save();
            });
        }
    }// end actions 
});
