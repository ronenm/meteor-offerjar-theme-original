Package.describe({
  name: 'ronenm:offerjar-theme-original',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'Official templates for the OfferJar UI',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.1');
  api.use('ronenm:offerjar-ui@0.0.2'); // This is a client only package
  api.use('ronenm:offerjar-i18n-official@0.0.2');
  api.use('ronenm:with-loading@1.0.0');
  api.use([
    'blaze',
    'spacebars',
    'templating',
    'minimongo',
  ], 'client');
  api.use('less');
  api.use('aldeed:template-extension@3.4.3','client');
  api.use('aldeed:autoform@5.1.0');
  api.use('lbee:moment-helpers@0.2.0','client');
  api.use('udondan:slick@1.3.0','client');
  api.use('underscore');
  api.use('underscorestring:underscore.string@3.0.3');
  
  api.addFiles("client/startup.js",'client');
  var templates_files = ['gallery','negotiation_dialog','negotiation_form', 'negotiation_history', 'negotiation'];
  for(var i = templates_files.length-1; i>=0; i--) {
    api.addFiles("client/templates/" + templates_files[i] + ".html",'client');
    api.addFiles("client/templates/" + templates_files[i] + ".js",'client');
  }
  var less_files = ['application','negotiation'];
  for(var i = less_files.length-1; i>=0; i--) {
    api.addFiles("client/stylesheets/" + less_files[i] + ".less",'client');
  }
  
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ronenm:offerjar-theme-original');
  api.addFiles('offerjar-theme-original-tests.js');
});
