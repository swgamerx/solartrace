import DS from 'ember-data';

export default DS.Model.extend({
    company: DS.belongsTo('company'),
    address: DS.belongsTo('address'),
    pins: DS.hasMany('pin'),
    type: DS.belongsTo('type'),
    createdDate: DS.attr('date'),
    updatedDate: DS.attr('date'),
    active: DS.attr('boolean'),
    deactivedBy: DS.belongsTo('user'),
    deactivatedDate: DS.attr('date'),
    squareMeters: DS.attr('number'),
    confirmations: DS.hasMany('confirmation')
});
