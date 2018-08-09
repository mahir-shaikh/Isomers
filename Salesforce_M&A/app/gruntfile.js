module.exports = function(grunt) {

  grunt.initConfig({
    nwjs: {
      options: {
        platforms: ['win64'],
        buildDir: 'build',
        version: '0.18.3',
        forceDownload: false,
        zip: true,
        cacheDir: '../cache',
        winIco: './assets/favicon.ico'
      },
      src: ['dist/**/*']
    }
  });

  grunt.loadNpmTasks('grunt-nw-builder');

  grunt.registerTask('build', ['nwjs']);

};