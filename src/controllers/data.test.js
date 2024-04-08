const { getDataAndSaveToFile } = require('./data.controller');
const { getAuthToken } = require('../services/auth/auth.service');
const { getItems } = require('../services/items/items.service');
const { getTransactions } = require('../services/transactions/transactions.service');
const { SaveDataToFile } = require('../services/file/file.service');
// Mock de la fonction getAuthToken
jest.mock('../services/auth/auth.service');
// Mock de la fonction getItems
jest.mock('../services/items/items.service');
// Mock de la fonction getTransactions
jest.mock('../services/transactions/transactions.service');
// Mock de la fonction SaveDataToFile
jest.mock('../services/file/file.service');

describe('getDataAndSaveToFile', () => {
  it('devrait récupérer les données, les enregistrer dans le fichier et afficher un message de succès', async () => {
    // Données simulées pour les mocks
    const mockAccessToken = { value: 'mockAccessToken', expires_at: 'mockExpiresAt', };
    const mockItems = [
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
    ];
    const mockTransactions = [
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
    ];

    // Mock des fonctions pour retourner les données simulées
    getAuthToken.mockResolvedValue({ access_token: mockAccessToken });
    getItems.mockResolvedValue({ items: mockItems });
    getTransactions.mockResolvedValue({ transactions: mockTransactions });

    // Appel de la fonction à tester
     await getDataAndSaveToFile();

    // // Vérification que les fonctions ont été appelées avec les bons arguments
     expect(getAuthToken).toHaveBeenCalled();
     expect(getItems).toHaveBeenCalledWith(mockAccessToken.value);
     expect(getTransactions).toHaveBeenCalledWith(mockAccessToken.value);
     expect(SaveDataToFile).toHaveBeenCalledWith({
       access_token: mockAccessToken,
       items: mockItems,
      transactions: mockTransactions,
     });
  });

  it('devrait afficher un message d\'erreur en cas d\'erreur lors de la récupération des données', async () => {
    // Erreur simulée pour le mock de getAuthToken
    const mockError = new Error('Erreur de récupération des données');
    getAuthToken.mockRejectedValueOnce(mockError);
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    // Appel de la fonction à tester
    await getDataAndSaveToFile();

    // Vérification que le message d'erreur est affiché dans la console
    expect(consoleErrorMock).toHaveBeenCalledWith('Une erreur s\'est produite :', mockError);
  });
});