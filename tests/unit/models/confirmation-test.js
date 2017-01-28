import { moduleForModel, test } from 'ember-qunit';

moduleForModel('confirmation', 'Unit | Model | confirmation', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
