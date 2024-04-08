const { getAuthToken } = require("../services/auth/auth.service");
const { SaveDataToFile } = require("../services/file/file.service");
const { getItems } = require("../services/items/items.service");
const { getTransactions } = require("../services//transactions/transactions.service");
exports.getDataAndSaveToFile = async () => {
  try {
    const { access_token } = await getAuthToken();
    const { items } = await getItems(access_token.value);
    const { transactions } = await getTransactions(access_token.value);
    const data = {
      access_token,
      items,
      transactions,
    };
    SaveDataToFile(data)

    console.log("Données enregistrées avec succès dans le fichier data.json");
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
};
