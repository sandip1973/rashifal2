export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { prompt } = req.body;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.8
      })
    });
    const data = await response.json();
    console.log('Groq:', JSON.stringify(data));
    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
