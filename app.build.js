({
    appDir: "web/",
    baseUrl: "js/",
    dir: "web-build",
    
    optimizeCss: "standard.keepLines",
    mainConfigFile: "web/js/main.js",
    
    inlineText: true,
    removeCombined: true,
    preserveLicenseComments: false,
	
    modules: [
        {
            name: "main"
        }
    ]
})