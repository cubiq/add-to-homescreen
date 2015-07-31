module.exports = function(grunt) {

    grunt.registerTask('images', [], function() {
		grunt.loadNpmTasks('grunt-contrib-imagemin');
		grunt.task.run('imagemin:dist');
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			dist: {
				files: {
					'dist/addtohomescreen.min.js': ['addtohomescreen.js'],
				},
			},
		},
		imagemin: {
			dist: {
				files: [{
					expand: true, // Enable dynamic expansion
					cwd: 'imgs', // Src matches are relative to this path
					src: ['**/*.{png,jpg,gif,svg}'], // Actual patterns to match
					dest: 'dist/img', // Destination path prefix
				}],
			},
			options: {
				cache: false,
			},
		}
	});

	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*', '@*/grunt-*', '!grunt-contrib-imagemin'],
	});

	grunt.registerTask('default', ['uglify:dist', 'images']);
};
