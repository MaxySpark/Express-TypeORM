import * as nodemailer from 'nodemailer';
import MailConfig from '../configs/mail.config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

class Mail {
    private oAuth2Client: OAuth2Client;

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
}