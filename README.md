# Regtech for Regulators Vendor Database

Site currently manually deployed at:

```
http://vendors.r2accelerator.org/
```

## Local development

For local development we may need a webserver, so it would be nice to have a dockerized Nginx. For that, run this from the root folder:

```
docker run --name nginx -v `pwd`:/usr/share/nginx/html -p 127.0.0.1:8080:80 -d nginx:latest
# Go to localhost:8080
# You may also need a `docker restart nginx` if you see Nginx default site

# We may also only run from our folder:
python -m SimpleHTTPServer
```

If the URL we are using for development contains `localhost` some behaviors would only be printed to developers console. Simple code is located at `isDevelopmentEnviroment` function.

Send analytics using `customGA` function.
