const axios = require('axios');
const path = require('path');
const fs = require('fs');

const QUALITY_API = process.env.QUALITY_API_URL || 'http://localhost:8001';

// gradeProduct(imagePaths) -> calls the CNN service /grade-from-paths endpoint.
// Falls back to an 'ungraded' result on failure so the core flow never breaks.
const gradeProduct = async (imagePaths = []) => {
  try {
    // Convert relative paths to absolute paths
    const absolutePaths = imagePaths.map((img) => {
      if (img.startsWith('/uploads')) {
        return path.join(__dirname, '../../', img);
      }
      return img;
    });

    const existingPaths = absolutePaths.filter((p) => fs.existsSync(p));

    if (existingPaths.length === 0) {
      return {
        grade: 'ungraded',
        confidence: 0,
        defects: ['No valid images found'],
        message: 'No images available for grading'
      };
    }

    const response = await axios.post(
      `${QUALITY_API}/grade-from-paths`,
      { image_paths: existingPaths },
      { timeout: 20000 }
    );

    return response.data;
  } catch (error) {
    console.error('Quality grading error:', error.message);
    return {
      grade: 'ungraded',
      confidence: 0,
      defects: ['Grading service unavailable'],
      message: 'Could not grade product at this time'
    };
  }
};

module.exports = { gradeProduct };

