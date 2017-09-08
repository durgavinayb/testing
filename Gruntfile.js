var _           = require('lodash');
var path        = require('path');
var fs          = require('fs');
var pagesPath   = 'public/pages/';
var devices     = ['default','mobile'];
var pages       = [
  'motherhood',
  '404',
  'about',
  'careers',
  'checkout',
  'culture',
  'faq',
  'free-food',
  'job-description',
  'jobs',
  'menu',
  'menu_optimized',
  'orders',
  'privacy-policy',
  'product',
  'profile',
  'referral',
  'terms-and-conditions',
  'referral-terms-and-conditions',
  'reset_password',
  'how-it-works',
  'contest',
  'landing',
  'corporate',
  'tv',
  'referafriend',
  'order-created',
  'voting-module',
  'press-articles'
];

module.exports = function (grunt) {

  function extractSrc(html) {
    var params = [];
    var startIndex = 0;
    var pos = html.indexOf('src="/', startIndex);
    while (pos>-1) {
      var start   = pos+5;
      var length  = html.indexOf('.js', pos+5)-start+3;
      var url     = html.substr(start,length);
      params.push('public'+url);
      startIndex = start+length;
      pos = html.indexOf('src="/', startIndex);
    }
    return params;
  }

  function extractHref(html) {
    var params = [];
    var startIndex = 0;
    var pos = html.indexOf('href="/', startIndex);
    while (pos>-1) {
      var start   = pos+6;
      var length  = html.indexOf('.css', pos+6)-start+4;
      var url     = html.substr(start,length);
      params.push('public'+url);
      startIndex = start+length;
      pos = html.indexOf('href="/', startIndex);
    }
    return params;
  }

  var uglify = {};
  var JSlist = [];
  _.forEach(devices,function(device){
    _.forEach(pages, function (page) {
      if (grunt.file.exists(path.join(pagesPath, page, '/devices/'+device+'/ejs/partials/scripts.ejs'))) {
        var html = grunt.file.read(path.join(pagesPath, page, '/devices/' + device + '/ejs/partials/scripts.ejs'), {encoding: 'utf8'});
        var paths = extractSrc(html);
        JSlist.push(pagesPath + page + '/devices/' + device + '/' + page + '.min.js');
        uglify[pagesPath + page + '/devices/' + device + '/' + page + '.min.js'] = paths;
      }
    });
  });

  var cssmin        = {};
  var fontAwesome   = {};
  _.forEach(devices,function(device){
    _.forEach(pages, function (page) {
      if (grunt.file.exists(path.join(pagesPath, page, '/devices/'+device+'/ejs/partials/styles.ejs'))){
        var html = grunt.file.read(path.join(pagesPath, page, '/devices/'+device+'/ejs/partials/styles.ejs'), {encoding: 'utf8'});
        var paths = extractHref(html);
        if (html.indexOf('font-awesome')>-1){
            var f = path.join(pagesPath, page, '/devices/'+device,page+'.min.css');
            if (!fontAwesome[f]) fontAwesome[f] = [];
            fontAwesome[f].push([
                'public/bower_components/font-awesome/css/font-awesome.min.css',
                f
            ]);
        }
        cssmin[pagesPath + page + '/devices/' + device + '/' + page + '.min.css'] = paths;
      }
    });
  });

  var list  = [];
  _.forEach(devices, function(device){
    _.forEach(pages, function (page) {
      if (grunt.file.exists(path.join(pagesPath, page, '/devices/'+device+'/ejs/partials/styles.ejs')) && _.indexOf(['checkout','profile'], page) == -1) {
        list.push(pagesPath + page + '/devices/' + device + '/' + page + '.min.css');
      }
    });
  });

  var touchScssFiles = [];

  _.forEach(devices, function(device){
    _.forEach(pages, function (page) {
      if (grunt.file.exists(path.join(pagesPath, page, '/devices/'+device+'/scss/layout.scss'))) {
        touchScssFiles.push(pagesPath + page + '/devices/' + device + '/scss/layout.scss');
      }
    });
  });

  grunt.initConfig({
    touch: {
      options: {
        time: Date.now() + 5000
      },
      target: touchScssFiles
    },
    uglify: {
      options: {
        mangle: false,
        preserveComments: false
      },
      target: {
        files:uglify
      }
    },
     remove: {
      options: {
        trace: true
      },
      fileList: list.concat(JSlist)
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1,
        keepSpecialComments: 0
      },
      target: {
        files: cssmin
      }
    },
    css_url_replace: {
      options: {
          staticRoot: 'public'
      },
      replace: {
          files: fontAwesome
      }
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: ['> 1%']
          })
        ]
      },
      dist: {
        src: list
      }
    }
  });


  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-remove');
  grunt.loadNpmTasks('grunt-touch');
  grunt.loadNpmTasks('grunt-css-url-replace');

  grunt.registerTask('printConfig', function() {
    grunt.log.writeln(JSON.stringify(grunt.config(), null, 2));
  });



  // 'printConfig', 'touch', 'remove', 'uglify', 'cssmin','css_url_replace','postcss'
  grunt.registerTask('default', ['printConfig', 'touch', 'remove', 'uglify', 'cssmin','css_url_replace','postcss']);

};
