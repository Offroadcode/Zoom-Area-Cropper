module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    var path = require("path");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        pkgMeta: grunt.file.readJSON("config/meta.json"),
        dest: grunt.option("target") || "dist",
        basePath: path.join(
            "<%= dest %>",
            "App_Plugins",
            "<%= pkgMeta.name %>"
        ),

        watch: {
            options: {
                spawn: false,
                atBegin: true
            },
            dll: {
                files: ['Umbraco/ZoomAreaCropper/**/*.cs'] ,
                tasks: ['msbuild:dist', 'copy:dll']
            },            
            js: {
                files: ["ZoomAreaCropper/**/*.js"],
                tasks: ["concat:dist"]
            },
            html: {
                files: ["ZoomAreaCropper/**/*.html"],
                tasks: ["copy:html"]
            },
            sass: {
                files: ["ZoomAreaCropper/**/*.scss"],
                tasks: ["sass", "copy:css"]
            },
            css: {
                files: ["ZoomAreaCropper/**/*.css"],
                tasks: ["copy:css"]
            },
            manifest: {
                files: ["ZoomAreaCropper/package.manifest"],
                tasks: ["copy:manifest"]
            }
        },

        concat: {
            options: {
                stripBanners: false
            },
            dist: {
                src: [
                    "ZoomAreaCropper/js/imageOnLoadDirective.js",
                    "ZoomAreaCropper/js/zoomAreaCropperController.js"
                ],
                dest: "<%= basePath %>/js/ZoomAreaCropper.js"
            }
        },

        copy: {
            dll: {
                cwd: 'Umbraco/ZoomAreaCropper/ZoomAreaCropper/bin/debug/',
                src: 'ZoomAreaCropper.dll',
                dest: '<%= dest %>/bin/',
                expand: true
            },            
            html: {
                cwd: "ZoomAreaCropper/views/",
                src: ["*.html"],
                dest: "<%= basePath %>/views/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            css: {
                cwd: "ZoomAreaCropper/css/",
                src: ["ZoomAreaCropper.css"],
                dest: "<%= basePath %>/css/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            manifest: {
                cwd: "ZoomAreaCropper/",
                src: ["package.manifest"],
                dest: "<%= basePath %>/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            umbraco: {
                cwd: "<%= dest %>",
                src: "**/*",
                dest: "tmp/umbraco",
                expand: true
            }
        },

        umbracoPackage: {
            options: {
                name: "<%= pkgMeta.name %>",
                version: "<%= pkgMeta.version %>",
                url: "<%= pkgMeta.url %>",
                license: "<%= pkgMeta.license %>",
                licenseUrl: "<%= pkgMeta.licenseUrl %>",
                author: "<%= pkgMeta.author %>",
                authorUrl: "<%= pkgMeta.authorUrl %>",
                manifest: "config/package.xml",
                readme: "config/readme.txt",
                sourceDir: "tmp/umbraco",
                outputDir: "pkg"
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            src: {
                src: ["app/**/*.js", "lib/**/*.js"]
            }
        },

        sass: {
            dist: {
                options: {
                    style: "compressed"
                },
                files: {
                    "ZoomAreaCropper/css/ZoomAreaCropper.css": "ZoomAreaCropper/sass/ZoomAreaCropper.scss"
                }
            }
        },

        clean: {
            build: '<%= grunt.config("basePath").substring(0, 4) == "dist" ? "dist/**/*" : "null" %>',
            tmp: ["tmp"]
        },

        msbuild: {
            options: {
                stdout: true,
                verbosity: 'quiet',
                maxCpuCount: 4,
                version: 4.0,
                buildParameters: {
                WarningLevel: 2,
                NoWarn: 1607
                }
            },
            dist: {
                src: ['Umbraco/ZoomAreaCropper/ZoomAreaCropper/ZoomAreaCropper.csproj'],
                options: {
                    projectConfiguration: 'Debug',
                    targets: ['Clean', 'Rebuild'],
                }
            }
        },
    });

    grunt.registerTask("default", [
        "concat",
        "sass:dist",
        "copy:html",
        "copy:manifest",
        "copy:css",
        "msbuild:dist",
        "copy:dll"
    ]);

    grunt.registerTask("umbraco", [
        "clean:tmp",
        "default",
        "copy:umbraco",
        "umbracoPackage",
        "clean:tmp"
    ]);
};
