fs = require 'fs'
{exec} = require 'child_process'
CoffeeScript = require 'coffee-script'
{parser, uglify} = require 'uglify-js'

src = './src'
tmp = './tmp'
dist = './dist'
eg = './examples'
todo = "#{eg}/todo"

version = JSON.parse(fs.readFileSync('./package.json')).version

header = """
  // Uniform v#{version}
  // Written by Luke Morton, MIT licensed.
  // https://github.com/DrPheltRight/uniform
"""

task 'build', 'Build Uniform', ->
  invoke 'clean'
  exec [
      "mkdir -p #{tmp}"
      "coffee -b -o #{tmp} #{src}/*.coffee"
    ].join(' && ')
  , ->
    
    code = ''
  
    for name in ['uniform']
        code += """
          #{fs.readFileSync "#{tmp}/#{name}.js"}
        """
      exec "rm -rf #{tmp}"
    
    code = """
      !function (definition) {
        if (typeof define == 'function' && typeof define.amd == 'object') {
          define(['require'], definition);
        } else {
          this.Uniform = definition(function (path) {
            // This is a fake require for jQuery
            return this['jQuery'];
          });
        }
      }(function(require) {
        #{code}
        return Uniform;
      });
    """

    console.log "Building Uniform #{version}"
    
    exec "mkdir -p #{dist}", ->
      fs.writeFileSync path, header + '\n' + code for path in [
        "#{dist}/uniform-#{version}.js"
        "#{eg}/lib/uniform.js"
      ]

      code = uglify.gen_code uglify.ast_squeeze uglify.ast_mangle parser.parse code

      fs.writeFileSync path, header + '\n' + code for path in [
        "#{dist}/uniform-#{version}.min.js"
        "#{eg}/lib/uniform.min.js"
      ]

      invoke 'build:example'

task 'clean', 'Delete distribution folder', ->
  exec "rm -rf #{dist}"

task 'build:example', 'Build example', ->
  console.log 'Building examples'
  exec "coffee -c #{eg}/todo/todo.coffee"