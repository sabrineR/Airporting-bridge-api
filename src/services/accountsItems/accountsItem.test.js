const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { getAccounts } = require("./accounts.items.service");

// Configuration de axios-mock-adapter
const mockAxios = new MockAdapter(axios);

describe("getAccounts", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("devrait récupérer la liste des comptes à un item avec succès", async () => {
    // Configuration du mock pour simuler la réponse de l'API Bridge
    const itemId = "111111";
    const token = "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const mockResponse = {
      resources: [
        {
          id: 11111,
          name: "test1",
          balance: "testbalance",
          status: "testStatus",
          status_code_info: "testCodeInfo",
          status_code_description: "testCodeDescription",
          is_paused: false,
          updated_at: "2022-04-22T14:53:00.200Z",
          type: "testType",
          currency_code: "EUR",
          loan_details: {},
          savings_details: null,
          iban: "xxxxxxxxx",
          is_pro: false,
        },
        {
          id: 222222,
          name: "test2",
          balance: "testbalance2",
          status: "testStatus2",
          status_code_info: "testCodeInfo2",
          status_code_description: "testCodeDescription2",
          is_paused: true,
          updated_at: "2022-04-22T14:53:00.200Z",
          type: "testType2",
          currency_code: "EUR",
          loan_details: {},
          savings_details: null,
          iban: "yyyyyyyyyyy",
          is_pro: false,
        },
      ],
      generated_at: "2024-04-07T23:39:18.920Z",
      pagination: {
        next_uri: null,
      },
    };
    mockAxios
      .onGet(`https://api.bridgeapi.io/v2/accounts?item_id=${itemId}`)
      .reply(200, mockResponse);

    // Appel de la fonction à tester
    const accounts = await getAccounts(itemId, token);

    // Vérification que la fonction retourne les comptes correctement
    expect(accounts).toHaveLength(mockResponse.resources.length);
     // Vérification que la fonction retourne la bonne format de resultat souhaité 
     expect(accounts).toEqual([
        {
            id: 11111,
            name:"test1",
            balance:"testbalance",
            status: "testStatus",
            status_code_info: "testCodeInfo",
            status_code_description: "testCodeDescription",
            updated_at: "2022-04-22T14:53:00.200Z",
            type: "testType",
            currency_code: "EUR",
            iban: "xxxxxxxxx",
          },
          {
            id: 222222,
            name:"test2",
            balance:"testbalance2",
            status: "testStatus2",
            status_code_info: "testCodeInfo2",
            status_code_description: "testCodeDescription2",
            updated_at: "2022-04-22T14:53:00.200Z",
            type: "testType2",
            currency_code: "EUR",
            iban: "yyyyyyyyyyy",
          }
     ]);
    });


  it("devrait lever une erreur en cas d'erreur lors de la récupération de la liste des comptes", async () => {
    // Configuration du mock pour simuler une réponse d'erreur de l'API Bridge
    const itemId = "111111";
    const token = "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    mockAxios
      .onGet(`https://api.bridgeapi.io/v2/accounts?item_id=${itemId}`)
      .reply(401);

    // Appel de la fonction à tester et vérification qu'une erreur est levée
    await expect(getAccounts(itemId, token)).rejects.toThrow(
      "Erreur lors de la recuperation de la liste des comptes : "
    );
  });

  it("devrait lever une erreur si itemId ou token sont manquants", async () => {
    // Appel de la fonction à tester sans itemId
    await expect(getAccounts(null, "yourToken")).rejects.toThrow(
      "itemId et token sont requis."
    );

    // Appel de la fonction à tester sans token
    await expect(getAccounts("yourItemId", null)).rejects.toThrow(
      "itemId et token sont requis."
    );
  });
});
