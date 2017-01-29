import DS from 'ember-data';

export default DS.Model.extend({
    longitude: DS.attr('number'),
    latitude: DS.attr('number')
});
