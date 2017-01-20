window.WallBlog = {
  title: "Tan, Johan, Evan & Lyam"
};
window.document.title = window.WallBlog.title;

import serviceWorkerInstall from 'sw/install';
import AppRouter from 'router';

// create and initialize our router
new AppRouter();

// register service worker
serviceWorkerInstall();
