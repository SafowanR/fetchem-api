import type { VercelRequest, VercelResponse } from '@vercel/node';

const MEDIA_SOURCE = 'https://downr.org/netlify/functions/nyt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const url = body?.url;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

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

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: 'Invalid response from source', raw: text.slice(0, 500) });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}