import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'), // Business's name
    description: DS.attr('string'), // Description of the business
    logo: DS.attr('string'), // business's logo
    addresses: DS.hasMany('address'),  // all the addresses for this business
    dateAdded: DS.attr('date') // Date business was added
});
