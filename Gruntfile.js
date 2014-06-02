module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        /* Add to Homescreen v3.0.6 ~ (c) 2014 Matteo Spinelli ~ @license: http://cubiq.org/license */
        banner: '/* Add to Homescreen v<%= pkg.version %> ~ (c) <%= grunt.template.today("yyyy") %> Matteo Spinelli ~ @license: http://cubiq.org/license */\n'
      },
      dist: {
        files: {
          'src/addtohomescreen.min.js': ['src/addtohomescreen.js']
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
};