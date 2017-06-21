import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('business', 'Unit | Model | business', {
  // Specify the other units that are required for this test.
  needs: ['model:address']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('Should have addresses', function(assert){
    const business = this.store().modelFor('business');
    const relationship = Ember.get(business, 'relationshipsByName').get('addresses');

    assert.equal(relationship.key, 'addresses', 'has a relationship with address');
    assert.equal(relationship.kind, 'hasMany', 'Has addressess');
});
