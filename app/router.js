import EmberRouter from "@ember/routing/router";
import config from "./config/environment";

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route("businesses");
  this.route("business", { path: "/business/:business_id" }, function() {
    this.route('trace');
  });
});

export default Router;
