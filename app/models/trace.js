import DS from "ember-data";

export default DS.Model.extend({
  pins: DS.hasMany("pin"), // all the gps pins
  type: DS.belongsTo("trace-type"), // what type of pin this is
  squareMeters: DS.attr("number")
});
