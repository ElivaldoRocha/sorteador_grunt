module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    less: {
      // Ambiente de desenvolvimendo/local: Maquina Local
      development: {
        files: {
          "dev/styles/main.css": "src/styles/main.less",
        },
      },
      // Ambiente de Produção: Executado na Versel
      production: {
        options: {
          compress: true,
        },
        files: {
          "dist/styles/main.min.css": "src/styles/main.less",
        },
      },
    },
    watch: {
      less: {
        // referenciar qualque aquivo com extensao .less, em qualquer pasta que esteja dentro de styles, que esta dentro de src.
        files: ["src/styles/**/*.less"],
        tasks: ["less:development"],
      },
      html: {
        files: ["src/index.html"],
        tasks: ["replace:dev"],
      },
    },
    replace: {
      dev: {
        options: {
          patterns: [
            {
              match: "ENDERECO_DO_CSS",
              replacement: "./styles/main.css",
            },
            {
              match: "ENDERECO_DO_JS",
              replacement: "../src/scripts/main.js",
            },
          ],
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ["src/index.html"],
            dest: "dev/",
          },
        ],
      },
      dist: {
        options: {
          patterns: [
            {
              match: "ENDERECO_DO_CSS",
              replacement: "./styles/main.min.css",
            },
            {
              match: "ENDERECO_DO_JS",
              replacement: "./scripts/main.min.js", // Adicione esta linha
            },
          ],
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ["prebuild/index.html"],
            dest: "dist/",
          },
        ],
      },
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: {
          "prebuild/index.html": "src/index.html",
        },
      },
    },
    clean: ["prebuild"],
    uglify: {
      target: {
        files: {
          "dist/scripts/main.min.js": "src/scripts/main.js",
        },
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("default", [
    "build", // Adiciona o build de produção como parte da tarefa padrão
    "watch", // Continua rodando o watch para desenvolvimento
  ]);

  grunt.registerTask("build", [
    "less:production",
    "htmlmin:dist",
    "replace:dist",
    "clean",
    "uglify",
  ]);
};
