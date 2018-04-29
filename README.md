Site currently manually deployed at:

```
http://vendors.r2accelerator.org/
```

For local development we may need a webserver would, so it would be nice to have a dockerized Nginx. For that, run this from the root folder:

```
docker run --name nginx -v `pwd`:/usr/share/nginx/html -p 8080:80 -d nginx:latest
# Go to localhost:8080
# You may also need a `docker restart nginx` if you see Nginx default site
```
