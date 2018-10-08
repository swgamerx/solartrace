import Component from "@ember/component";
import { get, computed } from "@ember/object";

export default Component.extend({
  numberOfTraces: computed("model.addresses", function() {
    let count = 0;
    if (get(this, "model.addresses")) {
      let addresses = get(this, "model.addresses");
      for (let i = 0; i < addresses.length; i++) {
        count += addresses[i].length;
      }
    }
    return count;
  }),
  actions: {}
});
