# NxMicroTest

This project is a test of using Nx and setting up some kind of lightweight proxy
server in front of the other apps.

Run:

```
pnpx nx serve micro-app
```

And optionally, in a separate window:

```
pnpx pm2 logs
```

Then, when you go to `http://localhost:3000/next-app` in your browser, this will
be detected by the fast start-up micro-app, which will proceed to start
micro-app for you.

You may also visit `http://localhost:3000/express-app`.

## micro-app tech specs

I looked at a few different options for the lightweight HTTP server in
micro-app.

Vercel's micro was an interesting option, however it turns out, as of 2021, they
have not really been actively maintaining it so much.

We are also limited by the
[HTTP proxy middleware](https://github.com/chimurai/http-proxy-middleware),
which uses a connect style API. From their list, I found an alternative to Micro
called Polka. Polka has a light API similar to Express and is compatible with
the middleware.

## Things to improve

- The logic to start up the new app does not work quite right, particularly the
  wait-on line
- We have port numbers defined in both the workspace.json and a config.js file,
  can be unified?
- Even better, can we support dynamic port numbers on startup?
- We should have a pm2 development config so we can start/stop the scripts with
  the CLI directly
- Should have an easy way to export the stdout from the app
- Experiment with flexible configs, can we support binding the apps as both
  middleware OR proxied apps?
- Experiment with dev/build modes. Nx can cache build results, can we let the
  user control what is running in built vs dev for performance?
- Can we expose a way to restart the apps?
- Look into serving a root level next.js app that can handle the favicon, error
  page, etc.
