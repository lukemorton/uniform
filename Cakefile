fs = require('fs')
{exec} = require('child_process')
{parser, uglify} = require('uglify-js')

src = './src'
tmp = './tmp'
dist = './dist'
eg = './examples'
test = './test'

version = JSON.parse(fs.readFileSync('./package.json')).version

header = """
  // Uniform v#{version}
  // Written by Luke Morton, MIT licensed.
  // https://github.com/DrPheltRight/uniform
"""

build_cmd = [
  "mkdir -p #{tmp}"
  "coffee -b -o #{tmp} #{src}/*.coffee"
]
build_cmd = build_cmd.join(' && ')

task 'build', 'Build Uniform', ->
  invoke('clean')

  exec build_cmd, ->
    code = ''
  
    for name in ['uniform']
        code += """
          #{fs.readFileSync("#{tmp}/#{name}.js")}
        """
      exec("rm -rf #{tmp}")
    
    code = """
      !function (definition) {
        var context = this,
          old = context.Uniform;

        if (typeof define == 'function' && typeof define.amd == 'object') {
          define(['require'], definition);
        } else {
          context.Uniform = definition(function (jQuery) {
            // This is a fake require for jQuery
            return context['$'];
          });

          context.Uniform.no_conflict = function () {
            context.Uniform = old;
            return this;
          };
        }
      }(function(require) {
      #{code}
      Uniform.$ = require('jquery');
      return Uniform;
      });
    """

    console.log("Building Uniform #{version}")
    
    exec "mkdir -p #{dist}", ->
      fs.writeFileSync path, "#{header}\n#{code}" for path in [
        "#{dist}/uniform-#{version}.js"
        "#{eg}/lib/uniform.js"
      ]

      code = parser.parse(code)
      code = uglify.ast_mangle(code)
      code = uglify.ast_squeeze(code)
      code = uglify.gen_code(code)

      fs.writeFileSync path, "#{header}\n#{code}" for path in [
        "#{dist}/uniform-#{version}.min.js"
        "#{eg}/lib/uniform.min.js"
      ]

      invoke('build:example')
      invoke('build:mocks')

task 'watch', 'Build on modification', ->
  waiting = no
  fs.watch src, (event, filename) ->
    return unless filename.indexOf('.coffee') > -1

    if waiting
      console.log('Waiting')
    else
      waiting = setTimeout((-> waiting = no), 2000)
      invoke('build')

task 'clean', 'Delete distribution folder', ->
  exec("rm -rf #{dist}")

task 'build:example', 'Build example', ->
  console.log('Building examples')
  exec("coffee -c #{eg}/*/*.coffee")

task 'build:mocks', 'Build mock', ->
  console.log('Building mocks')
  exec("coffee -c #{test}/mocks/*.coffee")