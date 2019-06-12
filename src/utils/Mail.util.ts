import * as nodemailer from 'nodemailer';
import * as Email from 'email-templates';
import * as path from 'path';
import MailConfig from '../configs/mail.config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Options } from 'nodemailer/lib/mailer';
import { getRepository } from 'typeorm';
import { Mail as MailEntity } from '../db/entities/Mail.entity';

export class Mail {
    private mailRepository = getRepository(MailEntity);
    private oAuth2Client: OAuth2Client;
    private smtpTransport: nodemailer.Transporter;
    public mailOptions: Options = {};
    private email: Email;

    constructor() {
        this.initializeGoogleOauth2Client();
        this.mailOptions.from = 'Kaaljoy Production<' + process.env.GOOGLE_MAIL_USER_EMAIL + '>';
    }

    private initializeGoogleOauth2Client() {
        this.oAuth2Client = new google.auth.OAuth2(
            MailConfig.googleMailClientId, // ClientID
            MailConfig.googleMailClientSecret, // Client Secret
            'https://developers.google.com/oauthplayground' // Redirect URL
        );

        this.oAuth2Client.setCredentials({
            refresh_token: MailConfig.googleMailRefreshToken
        });

    }

    private async initializeSMTPConfiguration() {
        try {
            const refreshTokenResponse = await this.oAuth2Client.getAccessToken();
            const accessToken = refreshTokenResponse.token;

            this.smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: MailConfig.googleMailUserEmail,
                    clientId: MailConfig.googleMailClientId,
                    clientSecret: MailConfig.googleMailClientSecret,
                    refreshToken: MailConfig.googleMailRefreshToken,
                    accessToken: accessToken
                }
            });


        } catch (e) {
            console.error(e);
        }

    }

    public async send(template: string, context: any) {
        try {
            await this.initializeSMTPConfiguration();
            this.email = new Email({
                message: {
                    from: ''
                },
                preview: false,

                // uncomment below to send emails in development/test env:
                send: true,
                transport: this.smtpTransport,
                juiceResources: {
                    preserveImportant: true,
                    webResources: {
                        relativeTo: path.join(__dirname, '../assets/mail', template)
                    }
                }
            });

            const mail = await this.email.send({
                template: path.join(__dirname, '../assets/mail', template),
                message: this.mailOptions,
                locals: context,
            })
            const new_mail = this.mailRepository.create({
                messageId: mail.messageId,
                recipient: mail.envelope.to[0]
            });
            console.log(new_mail);
            this.mailRepository.save(new_mail);

        } catch (e) {
            console.error(e);
        }
    }

    public async sendNoTemplate() {
        try {
            await this.initializeSMTPConfiguration();
            const mail = await this.smtpTransport.sendMail(this.mailOptions);
            const new_mail = this.mailRepository.create({
                messageId: mail.messageId,
                recipient: mail.envelope.to[0]
            });
            console.log(new_mail);
            this.mailRepository.save(new_mail);

        } catch (e) {
            console.error(e);
        }
    }


}