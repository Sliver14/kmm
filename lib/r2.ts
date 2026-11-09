import { S3Client } from '@aws-sdk/client-s3'

export const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || ''
export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || ''
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || ''
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || ''
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || ''

export function isR2Configured(): boolean {
  return Boolean(
    R2_ACCOUNT_ID &&
    R2_ACCESS_KEY_ID &&
    R2_SECRET_ACCESS_KEY &&
    R2_BUCKET_NAME
  )
}

let cachedS3Client: S3Client | null = null

export function getR2Client(): S3Client {
  if (cachedS3Client) return cachedS3Client

  if (!isR2Configured()) {
    throw new Error(
      'Cloudflare R2 is not fully configured. Please provide R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in your environment variables.'
    )
  }

  cachedS3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  })

  return cachedS3Client
}
