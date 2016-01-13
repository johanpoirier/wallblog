window.WallBlog = {
  title: "Tan, Johan, Evan & Lyam"
};
window.document.title = window.WallBlog.title;

import AppRouter from 'router';
import HeaderView from 'views/header';
import Events from 'events';

// header
window.headerView = new HeaderView();

// create and initialize our router
new AppRouter();
