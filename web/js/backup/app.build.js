({
    appDir: "../",
    baseUrl: "js/",
    dir: "../../web-build",

    paths: {
        "jquery": "lib/require-jquery",
        "Handlebars": "lib/Handlebars",
        "tmpl": "lib/tmpl",
        "i18n": "lib/i18n",
        "shortcut": "lib/shortcut",
        "jquery.mousewheel": "lib/jquery.mousewheel",
        "jquery.dateFormat": "lib/jquery.dateFormat",
        "jquery.filedrop": "lib/jquery.filedrop"
    },
    
    optimizeCss: "standard.keepLines",
    
    modules: [
        //Optimize the application files. Exclude jQuery since it is
        //included already in require-jquery.js
        {
            name: "main",
            include: ["tmpl", "i18n", "admin", "shortcut", "storage", "jquery.mousewheel", "jquery.filedrop"]
        }
    ]
})