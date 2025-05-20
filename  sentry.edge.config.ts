import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e5f2bc72ca302bf21fb3362a94d8c749@o4507629996146688.ingest.us.sentry.io/4509357315588096",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
