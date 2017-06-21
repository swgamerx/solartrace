import DS from 'ember-data';

export default DS.Model.extend({
    lat: DS.attr('number'), // latitude
    lng: DS.attr('number') // longitude
});
