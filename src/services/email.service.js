import nodemailer from 'nodemailer';

export const sendConfirmationEmail = async (applicantEmail, jobTitle) => {
    // secure: true for 465, false for other ports
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'maddison53@ethereal.email', // Mock credentials
            pass: 'jn7jnAPss4f63QBp6D'
        }
    });

    try {
        await transporter.sendMail({
            from: '"Job Portal" <no-reply@jobportal.com>',
            to: applicantEmail,
            subject: `Application Received: ${jobTitle}`,
            text: `Dear Applicant,\n\nYour application for the position of ${jobTitle} has been received successfully.\n\nBest Regards,\nJob Portal Team`
        });
        console.log(`Email sent to ${applicantEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
