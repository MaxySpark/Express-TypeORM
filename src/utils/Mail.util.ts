import * as nodemailer from 'nodemailer';
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

    constructor() {
        this.initializeGoogleOauth2Client();
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

    public async send() {
        try {
            await this.initializeSMTPConfiguration();
            const mail = await this.smtpTransport.sendMail(this.mailOptions);
            const new_mail = this.mailRepository.create({
                messageId: mail.messageId,
                recipient: mail.envelope.to[0]
            });
            
            this.mailRepository.save(new_mail);

        } catch (e) {
            console.error(e);
        }
    }


}