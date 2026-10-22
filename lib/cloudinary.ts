import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'kmm-lovetoons-media',
  api_key: process.env.CLOUDINARY_API_KEY || 'kmm_temp_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'kmm_temp_secret',
  secure: true,
})

export default cloudinary
