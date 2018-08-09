module.exports = function(grunt) {

  grunt.initConfig({
    nwjs: {
      options: {
        platforms: ['win64'],
        buildDir: 'build',
        version: '0.21.5',
        forceDownload: false,
        zip: true,
        cacheDir: '../cache',
        winIco: './assets/builder/bts.ico',
        flavor: 'sdk'
      },
      src: ['dist/**/*']
    }
  });

  grunt.loadNpmTasks('grunt-nw-builder');

  grunt.registerTask('build', ['nwjs']);

};