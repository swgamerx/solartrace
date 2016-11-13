import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    traces: DS.hasMany('trace'),
    description: DS.attr('string')
});
