import Route from "@ember/routing/route";
import { get } from "@ember/object";

export default Route.extend({
  model(params) {
    return get(this, "store").findRecord("business", params.id);
  }
});
