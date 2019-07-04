export const AwsConfig = {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    CloudFront: {
        ACCESS_KEY: process.env.AWS_CF_ACCESS_KEY,
        PRIVATE_KEY: process.env.AWS_CF_PRIVATE_KEY.replace(/\\n/g, '\n'),
        END_POINT: process.env.AWS_CF_END_POINT
    },
    S3: {
        BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
        REGION: process.env.AWS_S3_BUCKET_REGION
    }
}
