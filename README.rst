Build Status
------------

+-------------+----------------------------------------------------------------------------------------+
| Master      | .. image:: https://secure.travis-ci.org/johanpoirier/wallblog.png?branch=master        |
|             |    :target: https://travis-ci.org/johanpoirier/wallblog                                |
+-------------+----------------------------------------------------------------------------------------+
| Development | .. image:: https://secure.travis-ci.org/johanpoirier/wallblog.png?branch=silex-upgrade |
|             |    :target: https://travis-ci.org/johanpoirier/wallblog                                |
+-------------+----------------------------------------------------------------------------------------+

Concept
-------

- Simple blog composed by a wall of pictures.
- Comments are displayed when picture is zoomed.
- No admin interface, juste login first (Ctrl+Alt+L) then drag and drop your picture from your desktop and add a comment on the fly.

Stack
-----

- Silex
- Doctrine DBAL
- RequireJS
- Backbone.js
- jQuery
- Handlebars

Local build
------------

In root folder, execute :

 npm install
 
 bower install
 
 gulp

Docker build
------------

 cd docker

 ./build.sh

 ./run.sh

Logs
----

- logs/app.log: php app logs
- logs/gulp.log: gulp build logs

Demo
----

Go to http://wallblog.jops-dev.com
