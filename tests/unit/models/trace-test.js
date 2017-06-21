import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';
moduleForModel('trace', 'Unit | Model | trace', {
  // Specify the other units that are required for this test.
  needs: ['model:pin','model:trace-type']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('Should have pins', function(assert){
    const trace = this.store().modelFor('trace');
    const relationship = Ember.get(trace, 'relationshipsByName').get('pins');

    assert.equal(relationship.key, 'pins', 'has a relationship with pin');
    assert.equal(relationship.kind, 'hasMany', 'kind of relationship is hasMany');
});

test('Should belong to a trace type', function(assert){
    const trace = this.store().modelFor('trace');
    const relationship = Ember.get(trace, 'relationshipsByName').get('type');

    assert.equal(relationship.key, 'type', 'has a relationship with type');
    assert.equal(relationship.kind, 'belongsTo', 'kind of relationship is belongsTo');
});
