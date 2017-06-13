import DS from 'ember-data';

export default DS.Model.extend({
    address1: DS.attr('string'),
    address2: DS.attr('string'),
    city: DS.attr('string'),
    state: DS.attr('string'),
    zipcode: DS.attr('string'),
    business: DS.belongsTo('business'),
    lat: DS.attr('string'),
    lng: DS.attr('string'),
    placeId: DS.attr('string'),
    country: DS.attr('string')
});
