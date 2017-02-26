import DS from 'ember-data';
import hasLimited from 'emberfire-utils/utils/has-limited';

export default DS.Model.extend({
    name: DS.attr('string'),
    addresses: hasLimited('address', '$id',  '$id', {limitToFirst: 20}),
    logo: DS.attr('string'),
    addedDate: DS.attr('date'),
    lastUpdated: DS.attr('date')
});