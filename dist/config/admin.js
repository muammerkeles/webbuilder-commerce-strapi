"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    auth: {
        secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
        salt: env('API_TOKEN_SALT'),
    },
    transfer: {
        token: {
            salt: env('TRANSFER_TOKEN_SALT'),
        },
    },
    flags: {
        nps: env.bool('FLAG_NPS', true),
        promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
        enabled: true,
        config: {
            handler: (uid, { documentId, locale, status }) => {
                // This is just a dumb example
                if (status === 'published') {
                    return 'https://docs.strapi.io/';
                }
                return 'https://docs.strapi.io/dev-docs/intro';
            },
        },
    },
});
