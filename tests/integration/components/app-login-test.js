import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app-login', 'Integration | Component | app login', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{app-login}}`);

  assert.equal('', '');

});
