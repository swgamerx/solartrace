import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    efficiency: DS.attr('number'), // percentage
    manufacturer: DS.attr('string')
});
