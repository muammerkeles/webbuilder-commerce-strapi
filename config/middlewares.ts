export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'", "https:"],
          'script-src': [
            "'self'",
            'www.herkeseweb.com',
            'https://localhost:7268',
            'https://localhost'
          ],
          'connect-src': [
            "'self'",
            'https:',
            'http:',
            'www.herkeseweb.com',
            'localhost:7268',
            'localhost'
          ],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            "https://market-assets.strapi.io",
            `https://${process.env.STORAGE_ACCOUNT}.blob.core.windows.net`,
            'www.herkeseweb.com',
            'localhost:7268',
            'localhost'
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'www.herkeseweb.com',
            `https://${process.env.STORAGE_ACCOUNT}.blob.core.windows.net`,
            'localhost:7268',
            'localhost'
          ],
          'frame-src': [
            "'self'",
            'herkeseweb.com',
            'www.herkeseweb.com',
            'https://localhost:7268',
            'https://localhost',
            '127.0.0.1',
            '0.0.0.0'
          ],
          'child-src': [
            "'self'",
            'www.herkeseweb.com',
            'localhost:7268',
            'localhost'
          ], // Alternatif izin
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
