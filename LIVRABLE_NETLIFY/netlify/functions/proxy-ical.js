const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { url } = event.queryStringParameters;

  if (!url) {
    return { statusCode: 400, body: 'URL manquante' };
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/calendar',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
      }
    });

    if (!response.ok) {
      return { 
        statusCode: response.status, 
        body: `Erreur Booking: ${response.statusText}` 
      };
    }

    const data = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar',
        'Access-Control-Allow-Origin': '*', // Autorise votre app à lire les données
      },
      body: data
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: `Erreur Serveur: ${error.message}` 
    };
  }
};
