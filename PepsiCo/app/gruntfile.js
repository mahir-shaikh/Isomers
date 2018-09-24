module.exports = function (grunt) {

    grunt.initConfig({
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: './',
                    dest: 'dist/',
                    src: ['nwjs-config.json'],
                    rename: function (dest, src) {
                        return dest + src.replace('nwjs-config', 'package');
                    }
                }]
            },
            login: {
                files: [{
                    expand: true,
                    cwd: 'src/login',
                    dest: 'dist/',
                    src: ['**']
                }]
            }
        },
        nwjs: {
            options: {
                platforms: ['win32'],
                buildDir: 'build',
                version: '0.18.3',
                forceDownload: false,
                zip: true,
                cacheDir: 'cache',
                winIco: 'src/assets/favicon.ico'
            },
            src: ['dist/**/*']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-nw-builder');

    grunt.registerTask('build', ['nwjs']);

};