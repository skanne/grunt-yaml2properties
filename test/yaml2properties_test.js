'use strict';

var grunt = require('grunt');
var fs = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.test = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  default_options: function(test) {
    test.expect(4);

    var actual = grunt.file.read('tmp/default_options/example_dir/example.properties');
    var expected = grunt.file.read('test/expected/default_options/example_dir/example.properties');
    test.equal(actual, expected, 'Compiled YAML to .properties.');

    actual = grunt.file.read('tmp/default_options/i18n/i18n_ja.properties');
    expected = grunt.file.read('test/expected/default_options/i18n/i18n_ja.properties');
    test.equal(actual, expected, 'Internationalization file (Japanese).');

    actual = grunt.file.read('tmp/default_options/i18n/i18n_pt.properties');
    expected = grunt.file.read('test/expected/default_options/i18n/i18n_pt.properties');
    test.equal(actual, expected, 'Internationalization file (Portuguese).');

    actual = grunt.file.read('tmp/default_options/i18n/i18n.properties');
    expected = grunt.file.read('test/expected/default_options/i18n/i18n.properties');
    test.equal(actual, expected, 'Internationalization file (default).');

    test.done();
  },

  custom_options: function(test) {
    test.expect(2);
    test.ok(fs.existsSync('tmp/custom_options/_partial.properties') === false, 'Enabled ignored option.');

    var actual = grunt.file.read('tmp/custom_options/custom_types_example.properties');
    var expected = grunt.file.read('test/expected/custom_options/custom_types_example.properties');
    test.equal(actual, expected, 'Enabled customTypes option.');

    test.done();
  },

  middleware_options: function(test) {
    test.expect(3);
    test.ok(fs.existsSync('tmp/middleware_options/middleware.properties') === false, 'Enabled disableDest option.');

    var actual = grunt.file.read('tmp/middleware_options/response.properties');
    var expected = grunt.file.read('test/expected/middleware_options/response.properties');
    test.equal(actual, expected, 'Enabled middleware option.');

    actual = grunt.file.read('tmp/middleware_options/properties.properties');
    expected = grunt.file.read('test/expected/middleware_options/properties.properties');
    test.equal(actual, expected, 'Enabled middleware option.');

    test.done();
  }
};
