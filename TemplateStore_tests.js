"use strict";

// TemplateStore - _ensureDeps(key)

Tinytest.add('TemplateStore package - _ensureDeps() should set deps["key"] to a new Deps.Dependency.', function(test) {

    // Run the function
    TemplateStore._ensureDeps('key');

    // Then run the test
    test.instanceOf(TemplateStore.deps['key'], Deps.Dependency);

});


// TemplateStore - _getKeyName(id, propertyName)

Tinytest.add('TemplateStore package - _getKeyName() should generate and return a key name - eg: default_testPropertyName if the id paramter is not set.', function(test) {

    // Run the function
    var generatedKeyName = TemplateStore._getKeyName(false, 'testPropertyName');

    // Then run the test
    test.equal(generatedKeyName, 'default_testPropertyName');

});

Tinytest.add('TemplateStore package - _getKeyName() should generate and return a key name - eg: myId12345_testPropertyName if the id paramter is set to myId12345.', function(test) {

    // Run the function
    var generatedKeyName = TemplateStore._getKeyName('myId12345', 'testPropertyName');

    // Then run the test
    test.equal(generatedKeyName, 'myId12345_testPropertyName');

});

Tinytest.add('TemplateStore package - _getKeyName() should generate and return a key name - eg: myId12345_testPropertyName if the id paramter is an object.', function(test) {

    // Dummy ID object
    var id = {
        data: {
            _id: 'myId12345'
        }
    }

    // Run the function
    var generatedKeyName = TemplateStore._getKeyName(id, 'testPropertyName');

    // Then run the test
    test.equal(generatedKeyName, 'myId12345_testPropertyName');

});


// TemplateStore -> get(id, propertyName, options)

Tinytest.add('TemplateStore package - get() should create a Deps.Dependency.depend() for that key in the store with options added.', function(test) {

    // Dummy data
    var options = {
        reactive: true
    };

    // We need to run the set() function first
    TemplateStore.set('test', 'testPropertyName', 'testValue', options);

    // Run the function
    var keyValue = TemplateStore.get('test', 'testPropertyName', options);

    // Then run the tests

    // Checking that the TemplateStore keys with index of "test_testPropertyName" is a Deps.Dependency
    test.instanceOf(TemplateStore.deps['test_testPropertyName'], Deps.Dependency);

    // Now checking that the correct value is returned
    test.equal(keyValue, 'testValue');

    // @TODO: Check that depend() was called on the dependency which will need a second copy of this test

});


// TemplateStore -> set(id, propertyName,value, options)

Tinytest.add('TemplateStore package - set() When set is called every depending reactive function where `TemplateStore.get()` with the same key is called will rerun.', function(test) {

    var options = {
        reactive: true
    }

    // Call the function
    TemplateStore.set('test', 'testPropertyName', 'testValue', options);

    // The run our tests

    // Checking that the TemplateStore.deps[test_testPropertyName] has been set as a Deps.Dependency
    test.instanceOf(TemplateStore.deps['test_testPropertyName'], Deps.Dependency);

    // Check that TemplateStore.keys['test_testPropertyName'] has been set to 'testValue'
    test.equal(TemplateStore.keys['test_testPropertyName'], 'testValue');

    // @TODO: Check that changed() has been called on the Deps.Dependency at the key name if the options parameter has been set

});


// TemplateStore -> unset(id, propertyName, options)

Tinytest.add('TemplateStore package - unset() should clear a set property.', function(test) {

    // First call the set() function
    TemplateStore.set('test', 'testPropertyName', 'testValue');

    // Then check the values are present
    test.instanceOf(TemplateStore.deps['test_testPropertyName'], Deps.Dependency);
    test.equal(TemplateStore.keys['test_testPropertyName'], 'testValue');

    // Now call the unset() function with the same keys as above
    TemplateStore.unset('test', 'testPropertyName');

    // Then check they have been deleted (they equate to false)
    test.isFalse(TemplateStore.deps['test_testPropertyName']);
    test.isFalse(TemplateStore.keys['test_testPropertyName']);

});


// TemplateStore ->unsetAll(propertyName, options)

Tinytest.add('TemplateStore package - unsetAll() should clear all instances of a set property.', function(test) {

    // First, call the set() function
    TemplateStore.set('test', 'testPropertyName', 'testValue');

    // Then check the values are present
    test.instanceOf(TemplateStore.deps['test_testPropertyName'], Deps.Dependency);
    test.equal(TemplateStore.keys['test_testPropertyName'], 'testValue');

    // Now call the unsetAll() function
    TemplateStore.unsetAll('test_testPropertyName');

    // Then check they have been deleted (they equate to false)
    test.isFalse(TemplateStore.deps['test_testPropertyName']);
    test.isFalse(TemplateStore.keys['test_testPropertyName']);

});




