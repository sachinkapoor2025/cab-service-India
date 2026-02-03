"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmergencyAlert = void 0;
const client_sns_1 = require("@aws-sdk/client-sns");
const snsClient = new client_sns_1.SNSClient({});
const sendEmergencyAlert = async (topicArn, message, phone) => {
    const command = new client_sns_1.PublishCommand({
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
exports.sendEmergencyAlert = sendEmergencyAlert;
