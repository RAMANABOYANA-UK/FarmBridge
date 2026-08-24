// services/qualityService.js
// Calls the standalone CNN Quality Grading microservice (ml-quality) on port 8001.
// If the ML service is unavailable, it falls back to a deterministic mock grade so
// that product creation/regrade never breaks the core flow.

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';
const TIMEOUT_MS = 10000;

// Resolve a stored /uploads/... URL into a local filesystem path under backend/uploads
const resolveLocalPath = (imagePath) => {
  const base = __dirname + '/../..'; // -> backend/
  const clean = imagePath.replace(/^\/uploads\//, '/uploads/');
  return (base + clean).replace(/\\/g, '/');
};

// Deterministic fallback used when the CNN service is offline
const mockGrade = () => {
  return {
    grade: 'standard',
    confidence: 0.62,
    defects: [],
    source: 'mock' // indicates the mock was used
  };
};

// gradeProduct(imagePaths) -> calls CNN service; falls back to mock on failure
const gradeProduct = async (imagePaths) => {
  const paths = (imagePaths || []).map(resolveLocalPath);

  try {
    const response = await fetch(`${ML_SERVICE_URL}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: paths }),
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });

    if (!response.ok) {
      throw new Error(`ML service responded with status ${response.status}`);
    }

    const data = await response.json();

    return {
      grade: data.grade || 'ungraded',
      confidence: typeof data.confidence === 'number' ? data.confidence : 0,
      defects: Array.isArray(data.defects) ? data.defects : [],
      source: 'cnn'
    };
  } catch (error) {
    console.log(`[qualityService] ML grading unavailable (${error.message}) - using mock grade`);
    return mockGrade();
  }
};

module.exports = { gradeProduct };