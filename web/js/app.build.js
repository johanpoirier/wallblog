({
    appDir: "../",
    baseUrl: "js/",
    dir: "../../web-build",

    paths: {
        "jquery": "require-jquery"
    },
    
    optimizeCss: "standard.keepLines",
    
    modules: [
        //Optimize the application files. Exclude jQuery since it is
        //included already in require-jquery.js
        {
            name: "main",
            include: ["tmpl", "admin", "shortcut", "storage", "jquery.mousewheel", "jquery.filedrop"]
        }
    ]
})