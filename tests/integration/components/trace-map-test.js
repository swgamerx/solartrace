import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('trace-map', 'Integration | Component | trace map', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  let london = {
      lat: 45.519743,
      lng: -122.680522,
      zoom: 10
  };
  this.set('address',london);
  this.render(hbs`{{trace-map address=address}}`);

  assert.equal(this.$('div.leaflet-container').length, 1, 'Map container was added');
});
