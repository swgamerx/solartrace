import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    panelDensity: DS.attr('number'), // percentage of panels that cover an area
});
