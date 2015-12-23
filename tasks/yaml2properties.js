/*
 * grunt-yaml2properties
 * https://github.com/skanne/grunt-yaml2properties
 *
 * Copyright (c) 2015 Sven Kannengiesser
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    yaml = require('js-yaml'),
    _ = require('lodash');

module.exports = function(grunt) {
  var yamlSchema = null;
  var strictOption = false;
  var bannerOption = '';

  function loadYaml(filepath, options) {
    var data = grunt.file.read(filepath, options);

    try {
      return yaml.safeLoad(data, {
        schema: yamlSchema,
        filename: filepath,
        strict: strictOption
      });
    } catch (e) {
      grunt.warn(e);
      return null;
    }
  }

  function createYamlSchema(customTypes) {
    var yamlTypes = [];

    _.each(customTypes, function(resolver, tagAndKindString) {
      var tagAndKind = tagAndKindString.split(/\s+/);

      var yamlType = new yaml.Type(tagAndKind[0], {
        loadKind: tagAndKind[1],
        loadResolver: function(state) {
          var result = resolver.call(this, state.result, loadYaml);

          if (_.isUndefined(result) || _.isFunction(result)) {
            return false;
          } else {
            state.result = result;
            return true;
          }
        }
      });

      yamlTypes.push(yamlType);
    });

    return yaml.Schema.create(yamlTypes);
  }

  function json2Properties(json, prefix) {
    var lines = [];

    prefix = prefix ? prefix + '.' : '';

    if (_.isObject(json)) {
      _.each(json, function _each(value, key, list) {
        if (_.isString(value)) {
          lines.push(prefix + key + ' = ' + value.replace(/(.)/g, function _replacer(match, s) {
            var c = s.charCodeAt(0);
            if (c < 32 || c > 126) {
              s = c.toString(16);
              s = '\\u0000'.slice(0, 6 - s.length) + s;
            }
            return s;
          }));
        } else if (_.isNumber(value) || _.isBoolean(value)) {
          lines.push(prefix + key + ' = ' + value);
        } else if (_.isObject(value)) {
          lines = lines.concat(json2Properties(value, prefix + key));
        }
      });
    }

    return lines;
  }

  grunt.registerMultiTask('yaml2properties', 'Compile YAML files to .properties files', function() {
    var options = this.options({
      customTypes: {},
      ignored: null,
      middleware: function() {},
      disableDest: false,
      strict: false,
      readEncoding: grunt.file.defaultEncoding,
      writeEncoding: grunt.file.defaultEncoding,
      banner:
        '# Generated from "#{src}" with yaml2properties.\n' +
        '# Don\'t edit this file directly! Instead use the grunt-yaml2properties task to re-generate from the original YAML file.\n\n'
    });
    var readOptions = {
      encoding: options.readEncoding
    };
    var writeOptions = {
      encoding: options.writeEncoding
    };

    yamlSchema = createYamlSchema(options.customTypes);
    strictOption = options.strict;
    bannerOption = options.banner;

    _.each(this.files, function(filePair) {
      filePair.src.forEach(function(src) {
        if (grunt.file.isDir(src) || (options.ignored && path.basename(src).match(options.ignored))) {
          return;
        }

        var dest = filePair.dest.replace(/\.ya?ml$/, '.properties');
        var json = loadYaml(src, readOptions);
        var properties = json2Properties(json);
        var output = bannerOption.replace(/#\{src\}/g, src).replace(/#\{dest\}/g, dest) + properties.join('\n');

        if (_.isFunction(options.middleware)) {
          options.middleware(output, properties, src, dest);
        }

        if (!options.disableDest) {
          grunt.file.write(dest, output, writeOptions);
          grunt.log.writeln('Compiled ' + src.cyan + ' -> ' + dest.cyan);
        }
      });
    });
  });
};
