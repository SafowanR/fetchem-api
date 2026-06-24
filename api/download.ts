import type { VercelRequest, VercelResponse } from '@vercel/node';

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

    const response = await fetch('https://cobalt-nch0.onrender.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    console.log('cobalt status:', response.status);
    const data = await response.json();
    console.log('cobalt response:', JSON.stringify(data).slice(0, 300));

    return res.status(200).json(data);
  } catch (err: any) {
    console.log('error:', err.message);
    return res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}