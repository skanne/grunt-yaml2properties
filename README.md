# grunt-yaml2properties

[![npm version](https://badge.fury.io/js/grunt-yaml2properties.svg)](http://badge.fury.io/js/grunt-yaml2properties)
[![Build Status](https://secure.travis-ci.org/skanne/grunt-yaml2properties.png?branch=master)](http://travis-ci.org/skanne/grunt-yaml2properties)
[![Dependency Status](https://david-dm.org/skanne/grunt-yaml2properties.svg)](https://david-dm.org/skanne/grunt-yaml2properties)

> A [Grunt](https://github.com/gruntjs/grunt) plugin to convert [YAML](https://en.wikipedia.org/wiki/YAML) to [.properties](https://en.wikipedia.org/wiki/.properties) using [js-yaml](https://github.com/nodeca/js-yaml).

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-yaml2properties --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-yaml2properties');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: http://gruntjs.com/getting-started
[package.json]: https://docs.npmjs.com/getting-started/using-a-package.json

## The "yaml2properties" task

### Overview
In your project's [Gruntfile](http://gruntjs.com/sample-gruntfile), add a section named `yaml2properties` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  yaml2properties: {
    your_target: {
      options: {
        ignored: /^_/,
        customTypes: {
          '!include scalar': function(value, yamlLoader) {
            return yamlLoader(value);
          },
          '!max sequence': function(values) {
            return Math.max.apply(null, values);
          },
          '!extend mapping': function(value, yamlLoader) {
            return _.extend(yamlLoader(value.basePath), value.partial);
          }
        }
      },
      files: [
        {expand: true, cwd: 'yaml_directory/', src: ['**/*.yml'], dest: 'output_directory/'}
      ]
    },
  },
})
```
In a situation where you do not want to output a file, but want to manipulate the data on your own, you can provide a middleware function and disable the destination write process:

```js
grunt.initConfig({
  yaml2properties: {
    your_target: {
      options: {
        disableDest: true,    // Grunt will not create i18n.properties as per the destination of the files object
        middleware: function(output, properties, src, dest){
          console.log(output);      // the output that is saved in the .properties file
          console.log(properties);  // a list of the single properties
          console.log(src);         // Source file path
          console.log(dest);        // Destination file path
        }
      },
      files: {
        'i18n.properties':    ['i18n.yml']
      }
    },
  },
})
```

### Options

#### options.ignored
Type: `RegExp` or `String`
Default value: `null`

A value that specifies file pattern not to compile.

<!-- #### options.customTypes
Type: `Object`
Default value: `{}`

A Object that defines custom types to [js-yaml](https://github.com/nodeca/js-yaml). A Object key is a `tag` and `loadKind` pair which is separated with a white space (e.g. `!include scalar` or `!max sequence`, `!extend mapping`). A Object value is a wrapper of loadResolver function which take `value` and `yamlLoader` arguments.

See also js-yaml [document](https://github.com/nodeca/js-yaml/wiki/Custom-types). -->

#### options.middleware
Type: `Function`
Default value: `function(response, json, src, dest) {}`

A function which provides you an interface to manipulate the YAML before it becomes JSON, or manipulate the JSON after being stringified.

#### options.disableDest
Type: `Boolean`
Default value: `false`

A boolean flag which will prevent grunt-yaml2properties from creating an output file if you would like to just work with the middleware function.

#### options.strict
Type: `Boolean`
Default value: `false`

A boolean flag which makes js-yaml to throw errors instead of warnings.

#### options.readEncoding
Type: `String`
Default value: `grunt.file.defaultEncoding`

An override to the default buffer encoding used to read in the YAML file (`grunt.file.read`).

#### options.writeEncoding
Type: `String`
Default value: `grunt.file.defaultEncoding`

An override to the default buffer encoding used to write out the JSON file (`grunt.file.write`).


### YAML Usage Examples
See [shiwano](https://github.com/shiwano/cw-schema)'s schema.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][].


## Credits
- [grunt-yaml](https://github.com/shiwano/grunt-yaml) served as the foundation and starting point for this package – I just had to tweak it a little bit to output `.properties` instead of `.json` files. So, all kudos belong to [Shogo Iwano](https://github.com/shiwano). ありがとうございました！


## License
View the [LICENSE](https://github.com/skanne/grunt-yaml2properties/blob/master/LICENSE-MIT) file (MIT).
