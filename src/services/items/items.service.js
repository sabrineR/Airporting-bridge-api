require("dotenv").config();
const { getAccounts } = require("../accountsItems/accounts.items.service");
const axios = require("axios");
const { CLIENT_ID, CLIENT_SECRET, BRIDGE_VERSION, API_BRIDGE_PATH } =
process.env;

exports.getItems = async (token) => {
  try {
   
// Validation des données d'entrée
      if (!token) {
        throw new Error("token est requis.");
      }

    const headers = {
      "Client-ID": CLIENT_ID,
      "Client-Secret": CLIENT_SECRET,
      "Bridge-Version": BRIDGE_VERSION,
      Authorization: `Bearer ${token}`,
    };

    // Récupération des items depuis l'API Bridge
    const response = await axios.get(`${API_BRIDGE_PATH}/items`, { headers });
    const { resources } = response.data;

    // Récupération des comptes associés à chaque item
    const itemsWithAccounts = await Promise.all(
      resources.map(async (item) => {
        const accounts = await getAccounts(item.id, token);
        return {
          ...item,
          accounts: accounts,
        };
      })
    );
    return {
      items: itemsWithAccounts,
    };
  } catch (error) {
    throw new Error(
      "Erreur lors de la recuperation de la liste des items : " + error.message
    );
  }
};
