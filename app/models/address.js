import DS from "ember-data";

export default DS.Model.extend({
  address1: DS.attr("string"), // address line 1
  address2: DS.attr("string"), // address line 2
  city: DS.attr("string"), // city
  state: DS.attr("string"), // state
  zipcode: DS.attr("string"), // zipcode
  business: DS.belongsTo("business"), // the business this address belongs to
  lat: DS.attr("string"), // latitude position
  lng: DS.attr("string"), // longitude position
  placeId: DS.attr("string"), // the id for google places api
  country: DS.attr("string"), // country
  traces: DS.hasMany("trace") // all the traces for this address
});
