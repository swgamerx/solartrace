import DS from 'ember-data';

export default DS.Model.extend({
    email: DS.attr('string'),
    traces: DS.hasMany('trace'),
    addedDate: DS.attr('date')
});
