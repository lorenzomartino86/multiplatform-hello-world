(function (_, Kotlin) {
  'use strict';
  var Kind_CLASS = Kotlin.Kind.CLASS;
  function HelloWorldTemplate(firstName, lastName, platform) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.platform = platform;
    this.template = 'Hello World by ' + this.firstName + ' ' + this.lastName + ' from the amazing world of ' + this.platform + '!!';
  }
  HelloWorldTemplate.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'HelloWorldTemplate',
    interfaces: []
  };
  function HelloWorld() {
  }
  HelloWorld.prototype.greeting_6hosri$ = function (firstName, lastName, platform) {
    return (new HelloWorldTemplate(firstName, lastName, platform)).template;
  };
  HelloWorld.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'HelloWorld',
    interfaces: []
  };
  function helloWorld(firstName, lastName) {
    return (new HelloWorld()).greeting_6hosri$(firstName, lastName, 'NODE');
  }
  var package$template = _.template || (_.template = {});
  package$template.HelloWorldTemplate = HelloWorldTemplate;
  package$template.HelloWorld = HelloWorld;
  package$template.helloWorld = helloWorld;
  Kotlin.defineModule('index', _);
  return _;
}(module.exports, require('kotlin')));

//# sourceMappingURL=index.js.map
