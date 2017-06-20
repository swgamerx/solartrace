import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('service-places', 'Integration | Component | service places', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{service-places lat=0 lng=0 zoom=10}}`);

  assert.equal(this.$('div.leaflet-container').length, 1, 'Map container was added');


});
