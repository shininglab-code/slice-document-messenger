/* global lodash: true */
module.exports = function(grunt) {
    grunt.file.defaultEncoding = 'utf8';
    grunt.file.preserveBOM = true;
    
    lodash = require('lodash');

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        dirs: grunt.file.readYAML('config/dirs.yml'),
        messenger: grunt.file.readYAML('config/messenger.yml'),

        //Tasks
        clean: grunt.file.readYAML('config/clean.yml'),
        strip_code: grunt.file.readYAML('config/strip-code.yml'),
        concat: grunt.file.readYAML('config/concat.yml'),
        babel: grunt.file.readYAML('config/babel.yml'),
        eslint: grunt.file.readYAML('config/eslint.yml')
    };

    grunt.initConfig(config);

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    lodash.each(grunt.file.readYAML('config/task.yml'), function(tasks, name){
        grunt.registerTask(name, tasks);
    });

    grunt.registerTask('watcher', 'Watch mananger', function(part) {
        grunt.config.set('watch', grunt.file.readYAML('config/watch/' + (part || 'default') + '.yml'));
        grunt.task.run('watch');
    });
};