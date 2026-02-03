import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({});

export const sendEmergencyAlert = async (
  topicArn: string,
  message: string,
  phone?: string,
) => {
  const command = new PublishCommand({
    TopicArn: topicArn,
    Message: message,
    Subject: "Emergency Alert",
    MessageAttributes: phone
      ? {
          phone: {
            DataType: "String",
            StringValue: phone,
          },
        }
      : undefined,
  });
  await snsClient.send(command);
};
