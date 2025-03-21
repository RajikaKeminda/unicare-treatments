import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Media from '../models/mediaModel.js';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || '';

class MediaService {
  // Generate presigned URL for uploading
  async generateUploadUrl(fileName: string, fileType: string) {
    try {
      const key = `media/${uuidv4()}/${fileName}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType,
      });

      const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      // Store media information in database
      const media = new Media({
        url: key,
        type: fileType,
      });

      await media.save();

      return {
        presignedUrl,
        mediaId: media._id,
        key,
      };
    } catch (error) {
      throw new Error('Failed to generate upload URL');
    }
  }

  // Generate presigned URL for viewing/downloading
  async generateViewUrl(key: string) {

    // Decode key from base64 if encoded
    try {
      key = Buffer.from(key, 'base64').toString();
    } catch (error) {
      throw new Error('Invalid media key format');
    }
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return presignedUrl;
    } catch (error) {
      throw new Error('Failed to generate view URL');
    }
  }

  // Delete media from S3 and database
  async deleteMedia(mediaId: string) {
    try {
      const media = await Media.findById(mediaId);
      if (!media) {
        throw new Error('Media not found');
      }

      // Extract key from URL
      const key = media.url;

      // Delete from S3
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);

      // Delete from database
      await media.deleteOne();

      return { message: 'Media deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete media');
    }
  }

  // Get media by ID
  async getMediaById(mediaId: string) {
    try {
      const media = await Media.findById(mediaId);
      if (!media) {
        throw new Error('Media not found');
      }
      return media;
    } catch (error) {
      throw new Error('Failed to get media');
    }
  }

  // Get all media for a post
  async getMediaByPostId(postId: string) {
    try {
      const media = await Media.find({ postId: new mongoose.Types.ObjectId(postId) });
      return media;
    } catch (error) {
      throw new Error('Failed to get media for post');
    }
  }

  // Get all media
  async getAllMedia() {
    try {
      const media = await Media.find();
      return media;
    } catch (error) {
      throw new Error('Failed to get all media');
    }
  }
}

export default new MediaService();
