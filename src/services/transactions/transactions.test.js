const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { getTransactions } = require("./transactions.service");

// Création d'une instance du mock Axios
const mockAxios = new MockAdapter(axios);

describe("getTransactions", () => {

    // Réinitialise le mock après chaque test
  afterEach(() => {
    mockAxios.reset(); 
  });

  it("devrait récupérer les deux dernieres transactions avec succès", async () => {
    // Configuration du mock pour simuler une réponse réussie de l'API Bridge
    const mockResponse = {
      resources: [
        {
            "id": 1111111,
            "clean_description": "test",
            "bank_description": "test",
            "amount": 111,
            "date": "2022-04-26",
            "updated_at": "2022-04-22T14:53:00.048Z",
            "currency_code": "EUR",
            "category_id": 1,
            "account_id": 11111111,
            "show_client_side": true,
            "is_deleted": false,
            "is_future": true
          },
          {
            "id": 222222,
            "clean_description": "test",
            "bank_description": "testt",
            "amount": 222,
            "date": "2022-04-26",
            "updated_at": "2022-04-22T14:52:58.930Z",
            "currency_code": "EUR",
            "category_id": 2,
            "account_id": 44444,
            "show_client_side": true,
            "is_deleted": false,
            "is_future": true
          },
      ],
    };
    mockAxios.onGet("https://api.bridgeapi.io/v2/transactions").reply(200, mockResponse);

    // Appel de la fonction à tester
    const result = await getTransactions("Bearer xxxxxxxxxxxxxxxxxxxx");

    // Vérification que la fonction retourne les transactions correctement
    expect(result.transactions).toEqual(mockResponse.resources);
  });

  it("devrait lever une erreur en cas d'échec de récupération des transactions", async () => {
    // Configuration du mock pour simuler une réponse d'erreur de l'API Bridge
    mockAxios.onGet("https://api.bridgeapi.io/v2/transactions").reply(401);

    // Appel de la fonction à tester et vérification qu'une erreur est levée
    await expect(getTransactions("Bearer xxxxxxxxxxxxxxxxxxxx")).rejects.toThrow(
      "Erreur lors de la recuperation de la liste des transaction : "
    );
  });
});