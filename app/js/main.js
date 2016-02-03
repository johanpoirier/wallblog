window.WallBlog = {
  title: "Tan, Johan, Evan & Lyam"
};
window.document.title = window.WallBlog.title;

import AppRouter from 'router';
import HeaderView from 'views/header';
import MenuView from 'views/menu';
import Events from 'events';

// header
window.headerView = new HeaderView($('header'));

// menu
window.menuView = new MenuView({ el: $('nav') });

// create and initialize our router
new AppRouter();
