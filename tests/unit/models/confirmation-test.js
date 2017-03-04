import { moduleForModel, test } from 'ember-qunit';

moduleForModel('confirmation', 'Unit | Model | confirmation', {
  // Specify the other units that are required for this test.
  needs: ['model:trace','model:user']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
