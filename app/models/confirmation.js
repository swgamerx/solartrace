import DS from 'ember-data';

export default DS.Model.extend({
    isAccurate: DS.attr('boolean'),
    trace: DS.belongsTo('trace'),
    reporter: DS.belongsTo('user'),
    date: DS.attr('date')
});
