import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('add-business', 'Integration | Component | add business', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{add-business}}`);

  assert.equal(this.$('label[for="name"]').text().trim(), 'Business Name');
  assert.equal(this.$('label[for="logo"]').text().trim(), 'Business Logo');
  assert.equal(this.$('label[for="description"]').text().trim(), 'Business Description');

});
