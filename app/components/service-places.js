import Ember from 'ember';

export default Ember.Component.extend({
    business: null,
    didRender(){
        var map = document.getElementById('map');
        var service = new google.maps.places.PlacesService(map);
        var location = {lat: controller.get('lat'), lng: controller.get('lng')};
        service.textSearch(
          {
            location: location,
            query: [this.get(business)]
          },
          function(results, status){
              let places = results.map(function(place){
                  return {
                      lat: place.geometry.viewport.b.b,
                      lng: place.geometry.viewport.f.b,
                      placeId: place.place_id,
                      address1: place.formatted_address.split(',')[0],
                      city: place.formatted_address.split(',')[1],
                      state: place.formatted_address.split(',')[2].split(' ')[0],
                      zipcode: place.formatted_address.split(',')[2].split(' ')[1],
                      country: place.formatted_address.split(',')[3]
                  };
              });
              controller.set('mapPoints',places);
          }
        );
    }
});
