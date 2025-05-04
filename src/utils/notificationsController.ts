import admin from 'firebase-admin';

const {
    PROJECT_ID,
    PRIVATE_KEY_ID,
    PRIVATE_KEY,
    CLIENT_EMAIL,
    CLIENT_ID,
    FIREBASE_CLIENT_X509_CERT_URL,
} = process.env;

if (
    !PROJECT_ID ||
    !PRIVATE_KEY_ID ||
    !PRIVATE_KEY ||
    !CLIENT_EMAIL ||
    !CLIENT_ID ||
    !FIREBASE_CLIENT_X509_CERT_URL
) {
    throw new Error('Missing Firebase environment variables');
}

const serviceAccount = {
    type: 'service_account',
    project_id: PROJECT_ID,
    private_key_id: PRIVATE_KEY_ID,
    private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: CLIENT_EMAIL,
    client_id: CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: 'googleapis.com',
} as admin.ServiceAccount;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const sendPushNotification = async (token: string, message: string) => {
    try {
        const messagePayload = {
            token,
            notification: {
                title: 'PuntoRide',
                body: message,
            },
        };

        const response = await admin.messaging().send(messagePayload);
        console.log('Notificación enviada con éxito:', response);
        return response;
    } catch (error) {
        console.error('Error enviando la notificación:', error);
    }
};