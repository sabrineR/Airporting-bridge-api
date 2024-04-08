const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { getItems } = require("./items.service");

// Configuration de axios-mock-adapter
const mockAxios = new MockAdapter(axios);

describe("getItems", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("devrait récupérer la liste des items avec les comptes associés avec succès", async () => {
    // Configuration du mock pour simuler la réponse de l'API Bridge pour les items
    const token = "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const mockItemsResponse = {
      resources: [
        {
          id: 1234,
          status: 0,
          status_code_info: "test",
          status_code_description: "test",
          bank_id: 666,
        },
      ],
      generated_at: "2024-04-08T00:52:19.151Z",
      pagination: {
        next_uri: null,
      },
    };
    mockAxios
      .onGet("https://api.bridgeapi.io/v2/items")
      .reply(200, mockItemsResponse);

    // Configuration du mock pour simuler la réponse de la fonction getAccounts pour chaque item
    mockAxios
      .onGet("https://api.bridgeapi.io/v2/accounts?item_id=1234")
      .reply(200, {
        resources: [
          {
            id: 11111,
            name: "test1",
            balance: "testbalance",
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
            name: "test2",
            balance: "testbalance2",
            status: "testStatus2",
            status_code_info: "testCodeInfo2",
            status_code_description: "testCodeDescription2",
            updated_at: "2022-04-22T14:53:00.200Z",
            type: "testType2",
            currency_code: "EUR",
            iban: "yyyyyyyyyyy",
          },
        ],
      });

    // Appel de la fonction à tester
    const itemsWithAccounts = await getItems(token);

    //Vérification que la fonction retourne les items avec les comptes associés correctement
    expect(itemsWithAccounts).toEqual({
      items: [
        {
          id: 1234,
          status: 0,
          status_code_info: "test",
          status_code_description: "test",
          bank_id: 666,
          accounts: [
            {
              id: 11111,
              name: "test1",
              balance: "testbalance",
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
              name: "test2",
              balance: "testbalance2",
              status: "testStatus2",
              status_code_info: "testCodeInfo2",
              status_code_description: "testCodeDescription2",
              updated_at: "2022-04-22T14:53:00.200Z",
              type: "testType2",
              currency_code: "EUR",
              iban: "yyyyyyyyyyy",
            },
          ],
        },
      ],
    });
  });

  it("devrait lever une erreur en cas d'erreur lors de la récupération des items", async () => {
    // Configuration du mock pour simuler une réponse d'erreur de l'API Bridge pour les items
    const token = "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    mockAxios.onGet("https://api.bridgeapi.io/v2/items").reply(500);

    // Appel de la fonction à tester et vérification qu'une erreur est levée
    await expect(getItems(token)).rejects.toThrow(
      "Erreur lors de la recuperation de la liste des items : "
    );
  });

  it("devrait lever une erreur si le token est manquant", async () => {
    // Appel de la fonction à tester sans token
    await expect(getItems(null)).rejects.toThrow("token est requis.");
  });
});
