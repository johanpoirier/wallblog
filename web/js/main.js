window.WallBlog = {
    title: "Tan, Johan, Evan & Lyam"
};
window.document.title = window.WallBlog.title;

require(["config"], function() {
    require(['router', 'views/header', 'bootstrap', 'events'],
        function(AppRouter, HeaderView) {
            // header
            window.headerView = new HeaderView({
                root: "header"
            });

            // create and initialize our router
            new AppRouter();
        }
    );
});