import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route("trace");
  this.route("business", { path: "trace/business/:id" });
  this.route("address", { path: "trace/address/:address_id" });
  this.route("admin", function() {
    this.route("businesses");
  });
});

export default Router;
