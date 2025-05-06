// api/openrouter.js
const axios = require('axios');

module.exports = async (req, res) => {
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // OPTIONS-Anfragen für CORS beantworten
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Nur POST-Anfragen akzeptieren
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // API-Schlüssel aus Umgebungsvariablen
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API-Schlüssel nicht konfiguriert' });
    }

    // Anfrage an OpenRouter weiterleiten
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': req.headers.referer || 'https://physiozentrum.contextery.com',
          'X-Title': 'Physiotherapie Abschlussbericht'
        }
      }
    );

    // Antwort zurückgeben
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('OpenRouter API error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Fehler bei der Kommunikation mit dem KI-Service',
      details: error.response?.data || error.message
    });
  }
};
