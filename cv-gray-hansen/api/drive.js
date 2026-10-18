// Vercel Serverless Function: /api/drive.js
// Fetches live Google Drive files from folder: 1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const folderId = req.query.folderId || '1yMjZKi0HHhj7kbozoq8XraJQO9_3if7E';
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY || req.query.key;

  if (!apiKey) {
    // If no API key configured on Vercel, return instructions & fallback signal
    return res.status(200).json({
      status: 'notice',
      message: 'Google Drive API Key not set in Vercel environment. Use Google Apps Script Bridge or configure GOOGLE_DRIVE_API_KEY.',
      folderId,
      files: []
    });
  }

  try {
    const q = `'${folderId}' in parents and trashed = false`;
    const fields = 'files(id,name,mimeType,thumbnailLink,webContentLink,imageMediaMetadata,createdTime,modifiedTime)';
    const driveUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&key=${apiKey}&pageSize=100`;

    const response = await fetch(driveUrl);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ status: 'error', error: data.error });
    }

    // Process files and generate direct thumbnail / image view URLs
    const files = (data.files || []).map(file => {
      const isLandscape = file.imageMediaMetadata
        ? (file.imageMediaMetadata.width >= file.imageMediaMetadata.height)
        : !file.name.toLowerCase().includes('portrait') && !file.name.toLowerCase().includes('flyer');

      return {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        // Google Drive direct image URL with high-res parameter
        imageUrl: `https://lh3.googleusercontent.com/d/${file.id}=w1600`,
        thumbnailUrl: `https://lh3.googleusercontent.com/d/${file.id}=w800`,
        webContentLink: file.webContentLink,
        driveLink: `https://drive.google.com/file/d/${file.id}/view`,
        isLandscape,
        modifiedTime: file.modifiedTime
      };
    });

    // Cache on Vercel Edge for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      status: 'success',
      folderId,
      count: files.length,
      files
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
