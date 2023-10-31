import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import sesTransport from "nodemailer-ses-transport";

const sesClient = new SESClient({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const transporter = nodemailer.createTransport(sesTransport({
  ses: sesClient
}));

// Function to send email
const sendEmail = async (options) => {
  const mailOptions = {
    Source: 'azadkkurdi@gmail.com', // Your verified SES email
    Destination: {
      ToAddresses: Array.isArray(options.to) ? options.to : [options.to] // Ensure 'to' is an array
    },
    Message: {
      Subject: {
        Data: options.subject
      },
      Body: {
        Html: {
          Data: options.html || options.text // Use HTML if provided, otherwise fall back to text
        }
      }
    }
  };

  await sesClient.send(new SendEmailCommand(mailOptions));
}


export default sendEmail;
