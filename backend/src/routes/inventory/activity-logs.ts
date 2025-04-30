import express from 'express';
import { InventoryActivityLog } from '../../models/InventoryActivityLog';

const router = express.Router();

// Get all activity logs
router.get('/', async (req, res) => {
  try {
    const activityLogs = await InventoryActivityLog.find()
      .sort({ timestamp: -1 }) // Sort by most recent first
      .limit(1000); // Limit to last 1000 activities

    res.json({
      success: true,
      data: activityLogs
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity logs'
    });
  }
});

export default router; 