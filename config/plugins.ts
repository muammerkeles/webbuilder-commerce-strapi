import { EmailClient } from "@azure/communication-email";

export default ({ env }: { env: (key: string, defaultValue?: string) => string }) => {
  const connectionString = env("AZURE_COMMUNICATION_CONNECTION_STRING");
  const senderEmail = env("AZURE_COMMUNICATION_SENDER_EMAIL");

  return {
    email: {
      config: {
        providerOptions: {},
        settings: {
          defaultFrom: senderEmail,
          defaultReplyTo: senderEmail,
          send: async (options: { to: string; subject: string; text: string; html?: string }) => {
            try {
              const client = new EmailClient(connectionString);
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
            } catch (error) {
              console.error("Azure Email Error:", error);
              throw new Error("Failed to send email via Azure Communication Services");
            }
          },
        },
      },
    }
  };
};
