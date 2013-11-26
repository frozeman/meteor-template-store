Package.describe({
    summary: "A reactive store based on IDs for template instance specific triggers"
});

Package.on_use(function (api) {

    // third party
    api.use('underscore', 'client');

    api.export('TemplateStore');

    // FILES
    api.add_files('TemplateStore.js', 'client');
});

Package.on_test(function (api) {

    api.use('template-store');
    api.use('tinytest');
    api.add_files('TemplateStore_tests.js', 'client');

});