import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    addresses: DS.hasMany('address'),
    logo: DS.attr('string'),
    addedDate: DS.attr('date'),
    lastUpdated: DS.attr('date')
});