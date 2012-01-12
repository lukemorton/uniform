fs = require 'fs'
{exec} = require 'child_process'
CoffeeScript = require 'coffee-script'
{parser, uglify} = require 'uglify-js'

src = './src'
tmp = './tmp'
dist = './dist'

header = """
  // Uniform
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

    version = JSON.parse(fs.readFileSync('./package.json')).version
    console.log "Building Uniform #{version}"
    
    exec "mkdir -p #{dist}", ->
      fs.writeFileSync "#{dist}/uniform-#{version}.js", header + '\n' + code

      code = uglify.gen_code uglify.ast_squeeze uglify.ast_mangle parser.parse code
      fs.writeFileSync "#{dist}/uniform-#{version}.min.js", header + '\n' + code

task 'clean', 'Delete distribution folder', ->
  exec "rm -rf #{dist}"