import DS from 'ember-data';

export default DS.Model.extend({
    company: DS.belongsTo('company'),
    address: belongsTo('address'),
    pins: DS.hasMany('pin'),
    type: DS.belongsTo('type'),
    createdDate: DS.attr('date'),
    updatedDate: DS.attr('date')
});
