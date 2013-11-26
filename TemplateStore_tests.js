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
    var key = TemplateStore.get('test', 'testPropertyName', options);

    // Then run the tests

    // Checking that the TemplateStore keys with index of "test_testPropertyName" is a Deps.Dependency
    test.instanceOf(TemplateStore.deps['test_testPropertyName'], Deps.Dependency);

    // Now checking that the correct value is returned
    test.equal(key, 'testValue');

});


