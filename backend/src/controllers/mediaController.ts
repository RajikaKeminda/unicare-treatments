import { Request, Response } from 'express';
import mediaService from '../services/mediaService.js';
import HttpStatusCodes from '../util/statusCodes.js';

// Generate upload URL for media
export const generateUploadUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'fileName, fileType, and postId are required',
      });
      return;
    }

    const result = await mediaService.generateUploadUrl(fileName, fileType);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to generate upload URL',
    });
  }
};

// Generate view URL for media
export const generateViewUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;

    if (!key) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Media key is required',
      });
      return;
    }

    const viewUrl = await mediaService.generateViewUrl(key);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: { viewUrl },
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to generate view URL',
    });
  }
};

// Delete media
export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mediaId } = req.params;

    if (!mediaId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Media ID is required',
      });
      return;
    }

    await mediaService.deleteMedia(mediaId);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Media not found') {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Media not found',
      });
      return;
    }

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to delete media',
    });
  }
};

// Get media by ID
export const getMediaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mediaId } = req.params;

    if (!mediaId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Media ID is required',
      });
      return;
    }

    const media = await mediaService.getMediaById(mediaId);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: media,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Media not found') {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Media not found',
      });
      return;
    }

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to get media',
    });
  }
};

// Get all media for a post
export const getMediaByPostId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!postId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Post ID is required',
      });
      return;
    }

    const media = await mediaService.getMediaByPostId(postId);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: media,
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to get media for post',
    });
  }
};
