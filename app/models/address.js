import DS from 'ember-data';

export default DS.Model.extend({
    company: DS.belongsTo('company'),
    address1: DS.attr('string'),
    address2: DS.attr('string'),
    city: DS.attr('string'),
    state: DS.attr('string'),
    zipcode: DS.attr('number'),
    longitude: DS.attr('number'),
    latitude: DS.attr('number'),
    addedDate: DS.attr('date')
});
