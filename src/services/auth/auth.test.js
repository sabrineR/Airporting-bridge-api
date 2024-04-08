const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { getAuthToken } = require('./auth.service');

// Configuration de axios-mock-adapter
const mockAxios = new MockAdapter(axios);

describe('getAuthToken', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it('devrait récupérer le jeton d\'authentification avec succès', async () => {
    // Configuration du mock pour simuler la réponse de l'API Bridge
    const mockResponse = {
      access_token: 'mockAccessToken',
      expires_at: 'mockExpiresAt'
    };
    mockAxios.onPost('https://api.bridgeapi.io/v2/authenticate').reply(200, mockResponse);

    // Appel de la fonction à tester
    const authToken = await getAuthToken();

    // Vérification que la fonction retourne le jeton d'authentification correctement
    expect(authToken).toEqual({
      access_token: {
        value: 'mockAccessToken',
        expires_at: 'mockExpiresAt'
      }
    });
  });

  it('devrait lever une erreur en cas de réponse incorrecte de l\'API Bridge', async () => {
    // Configuration du mock pour simuler une réponse incorrecte de l'API externe
    mockAxios.onPost('https://api.bridgeapi.io/v2/authenticate').reply(401);

    // Appel de la fonction à tester et vérification qu'une erreur est levée
    await expect(getAuthToken()).rejects.toThrow('Erreur lors de l\'authentification');
  });
});