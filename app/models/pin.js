import DS from 'ember-data';

export default DS.Model.extend({
  //  trace: DS.belongsTo('trace'),
    longitude: DS.attr('number'),
    latitude: DS.attr('number')
});
