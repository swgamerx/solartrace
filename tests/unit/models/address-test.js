import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('address', 'Unit | Model | address', {
  // Specify the other units that are required for this test.
  needs: ['model:business','model:trace']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('Should belong to a business', function(assert){
    const address = this.store().modelFor('address');
    const relationship = Ember.get(address, 'relationshipsByName').get('business');

    assert.equal(relationship.key, 'business', 'has a relationship with business');
    assert.equal(relationship.kind, 'belongsTo', 'kind of relationship is belongsTo');
});

test('Should have traces', function(assert){
    const address = this.store().modelFor('address');
    const relationship = Ember.get(address, 'relationshipsByName').get('traces');

    assert.equal(relationship.key, 'traces', 'has a relationship with trace');
    assert.equal(relationship.kind, 'hasMany', 'has many traces');
});
