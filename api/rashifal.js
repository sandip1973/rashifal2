export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { prompt } = req.body;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }]
      })
    });

    const raw = await response.text();
    console.log('Gemini status:', response.status);
    console.log('Gemini response:', raw);

    if (!response.ok) {
      return res.status(500).json({ error: 'Gemini error: ' + raw });
    }

    const data = JSON.parse(raw);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.status(200).json({ text });

  } catch (err) {
    console.log('Catch error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
