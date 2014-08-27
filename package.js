Package.describe({
    name: "mrt:animation-helper",
    summary: "Deprecated use mrt:template-session2, A reactive store based on IDs for template specific triggers",
    version: "0.1.4",
    git: "https://github.com/frozeman/meteor-template-store.git"

});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@0.9.0');

    // core
    api.use('underscore', 'client');


    api.export('TemplateStore');

    // FILES
    api.addFiles('TemplateStore.js', 'client');
});

Package.on_test(function (api) {

    api.use('mrt:template-store');
    api.use('tinytest');
    api.addFiles('TemplateStore_tests.js', 'client');

});