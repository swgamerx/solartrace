import { moduleForModel, test } from 'ember-qunit';

moduleForModel('trace', 'Unit | Model | trace', {
  // Specify the other units that are required for this test.
  needs: ['model:company','model:address','model:pin','model:type','model:user','model:confirmation']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
