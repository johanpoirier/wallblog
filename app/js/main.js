import serviceWorkerInstall from 'sw/install';
import AppRouter from 'router';
import Events from 'utils/events';
import PubSub from 'utils/pubsub';

window.WallBlog = {
  title: blogTitle
};
window.document.title = blogTitle;
window.document.querySelector('meta[name="apple-mobile-web-app-title"]').setAttribute('content', blogTitle);

// create and initialize our router
new AppRouter();

// register service worker
serviceWorkerInstall().then(() => PubSub.trigger(Events.SERVICE_WORKER_READY));
