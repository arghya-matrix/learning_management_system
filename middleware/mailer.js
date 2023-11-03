const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: process.env.HOST_TEST_MAIL,
  port: process.env.PORT_TEST_MAIL,
  secure: true,
  auth: {
    user: process.env.USERNAME_TEST_MAIL,
    pass: process.env.PASSWORD_TEST_MAIL,
  },
});

async function sendMailToUser({ Admin, body, stat }) {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const info = await transporter.sendMail({
    from: `eduKeda👻" <${process.env.TEST_MAIL_ID}>`, // sender address
    to: `${body.email_address}`, // list of receivers
    subject: "Registration Approval ✔", // Subject line
    html: `<b>Dear User ${body.Name},
    <p>I hope this email finds you well.</p>
    <p>We wanted to inform you about the status of your registration application
    Your account with has been ${stat}ed</p></b>
    
    <p>Thank you for your attention.</p>
        
        <p>Sincerely,</p>
        <p>eduKeda</p>
        <p>Date : ${formattedDate} </p>`,
  });
  const messageUrl = nodemailer.getTestMessageUrl(info);
  return messageUrl;
}

async function sendMailToAdmin({ Admin, user }) {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const info = await transporter.sendMail({
    from: `eduKeda👻" <${process.env.TEST_MAIL_ID}>`, // sender address
    to: `<${Admin.email_address}>`, // list of receivers
    subject: "New Registration ✔", // Subject line
    html: `<h1>New ${user.user_type} Registration Notification</h1>
        <p>Hello ${Admin.Name},</p>
        
        <p>A new ${user.user_type} has registered on your platform. Here are the user details:</p>
        
        <ul>
            <li><strong>Name:</strong> ${user.Name}</li>
            <li><strong>Email:</strong>${user.email_address} </li>
            <li><strong>Username:</strong>${user.user_name} </li>
            <li><strong>Registration Date:</strong> ${formattedDate} </li>
        </ul>
        
        <p>You may want to review and approve the new user's registration.</p>
        
        <p>Thank you for your attention.</p>
        
        <p>Sincerely,</p>
        <p>eduKeda</p>
        <p>Date : ${formattedDate} </p>`,
  });
  return;
}

async function sendMailToSubAdmin({ Admin, subAdmin, user }) {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const info = await transporter.sendMail({
    from: `${Admin}👻" <${process.env.TEST_MAIL_ID}>`, // sender address
    to: `<${subAdmin.email_address}>`, // list of receivers
    subject: "Assigned User for Registration ✔", // Subject line
    html: `<h1>New User Registration Notification</h1>
        <p>Hello Admin,</p>
        
        <p>A new ${user.user_type} has registered on platform assigned over you to check out the details and 
        act accordingly. Here are the user details:</p>
        
        <ul>
            <li><strong>Name:</strong> ${user.Name}</li>
            <li><strong>Email:</strong>${user.email_address} </li>
            <li><strong>Username:</strong>${user.user_name} </li>
            <li><strong>Registration Date:</strong> ${user.createdAt} </li>
        </ul>
        
        <p>You may want to review and approve the new user's registration.</p>
        
        <p>Thank you for your attention.</p>
        
        <p>Sincerely,</p>
        <p>eduKeda</p>
        <p>Date : ${formattedDate} </p>`,
  });
  // console.log(info, "<<--- message info");
  const messageUrl = nodemailer.getTestMessageUrl(info);
  return messageUrl;
}

async function sendMailToUserOnSignUp({ Admin, user }) {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const info = await transporter.sendMail({
    from: `eduKeda👻" <${process.env.TEST_MAIL_ID}>`, // sender address
    to: `<${user.email_address}>`, // list of receivers
    subject: "Welcome To eduKeda ✔", // Subject line
    html: `<h1>You have just registered to our platform as a ${user.user_type} </h1>
        <p>Hello ${user.Name},</p>
        
        <p>Please wait till admin approves your request.</p>
        <p>Your have signed up with below details.</p>
        
        <ul>
            <li><strong>Name:</strong> ${user.Name}</li>
            <li><strong>Email:</strong>${user.email_address} </li>
            <li><strong>Username:</strong>${user.user_name} </li>
            <li><strong>Registration Date:</strong> ${user.createdAt} </li>
        </ul>
                
        <p>Thank you for your attention.</p>
        
        <p>Sincerely,</p>
        <p>eduKeda</p>
        <p>Date : ${formattedDate} </p>`,
  });
  // console.log(info, "<<--- message info");
  const messageUrl = nodemailer.getTestMessageUrl(info);
  return messageUrl;
}

async function sendMailToSubscribedStudents({ Teacher, user, classData }) {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const info = await transporter.sendMail({
    from: `eduKeda👻" <${process.env.TEST_MAIL_ID}>`, // sender address
    to: `${body.email_address}`, // list of receivers
    subject: "Registration Approval ✔", // Subject line
    html: `<b>Dear ${body.Name},
    <p>I hope this email finds you well.</p>
    <p>We are excited to inform you that a new class has been created by your teacher, ${Teacher.Name}, 
    on ${classData.date} at ${classData.time}. This class is for the subject "[Subject Name]."
    <p>We wanted to inform you about the status of your registration application
    Your account with has been ${stat}ed</p></b>
    
    <p>Thank you for your attention.</p>
        
        <p>Sincerely,</p>
        <p>eduKeda</p>
        <p>Date : ${formattedDate} </p>
        Subject: New Class Created: [Class Name]



Here are the details of the class:

Class Name: [Class Name]
Date: [Date]
Time: [Time]
Subject: [Subject Name]
Teacher: [Teacher's Name]

This is a great opportunity for you to learn and grow. We encourage you to attend the class and actively participate in the learning experience.

If you have any questions or need further information about the class, please feel free to reach out to your teacher, [Teacher's Email].

We look forward to seeing you in the class and hope you have a productive and enjoyable learning experience.

Best regards,
[Your School/Organization Name]
[Contact Information]
        `,
  });
}

module.exports = {
  sendMailToUser,
  sendMailToAdmin,
  sendMailToSubAdmin,
  sendMailToUserOnSignUp,
};
