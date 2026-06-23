import type { VercelRequest, VercelResponse } from '@vercel/node';

const MEDIA_SOURCE = 'https://downr.org/netlify/functions/nyt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(MEDIA_SOURCE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://downr.org',
        'Referer': 'https://downr.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}