import { moduleFor, test } from 'ember-qunit';

moduleFor('route:trace', 'Unit | Route | trace', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});

// Try searching for the address 7044 Charlotte Pike, Nashville, TN
/*
test('try to find address', function(assert){
    fillIn('input[name="address"]','7044 Charlotte Pike');
    fillIn('input[name="city"]','Nashville');
    fillIn('input[name="state"]','TN');
    click('.find-address');
    andThen(() => assert.equal(locationSet, true));
});
*/
