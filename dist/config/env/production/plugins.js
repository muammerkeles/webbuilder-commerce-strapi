"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const communication_email_1 = require("@azure/communication-email");
exports.default = ({ env }) => {
    const connectionString = env("AZURE_COMMUNICATION_CONNECTION_STRING");
    const senderEmail = env("AZURE_COMMUNICATION_SENDER_EMAIL");
    return {
        email: {
            config: {
                providerOptions: {},
                settings: {
                    defaultFrom: senderEmail,
                    defaultReplyTo: senderEmail,
                    send: async (options) => {
                        try {
                            const client = new communication_email_1.EmailClient(connectionString);
                            const message = {
                                senderAddress: senderEmail,
                                content: {
                                    subject: options.subject,
                                    plainText: options.text,
                                    html: options.html || options.text,
                                },
                                recipients: {
                                    to: [{ address: options.to }],
                                },
                            };
                            const poller = await client.beginSend(message);
                            const result = await poller.pollUntilDone();
                            if (result.status !== "Succeeded") {
                                throw new Error(`Email failed with status: ${result.status}`);
                            }
                        }
                        catch (error) {
                            console.error("Azure Email Error:", error);
                            throw new Error("Failed to send email via Azure Communication Services");
                        }
                    },
                },
            },
        },
        upload: {
            config: {
                provider: "strapi-provider-upload-azure-storage",
                providerOptions: {
                    authType: env("STORAGE_AUTH_TYPE", "default"),
                    account: env("STORAGE_ACCOUNT"),
                    accountKey: env("STORAGE_ACCOUNT_KEY"),
                    serviceBaseURL: env("STORAGE_URL"), // optional
                    containerName: env("STORAGE_CONTAINER_NAME"),
                    defaultPath: "assets",
                    cdnBaseURL: env("STORAGE_CDN_URL"), // optional
                },
            },
        },
    };
};
