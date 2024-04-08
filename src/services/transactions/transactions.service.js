require("dotenv").config();
const axios = require("axios");
const { CLIENT_ID, CLIENT_SECRET, BRIDGE_VERSION, API_BRIDGE_PATH } =
  process.env;

exports.getTransactions = async (token) => {
  try {
    const headers = {
      "Client-ID": CLIENT_ID,
      "Client-Secret": CLIENT_SECRET,
      "Bridge-Version": BRIDGE_VERSION,
      Authorization: `Bearer ${token}`,
    };

    // Paramètres de la requête pour retourner les 2 dernières transactions bancaires
    const params = { limit: 2 };

    // Appel à l'API Bridge pour récupérer les transactions
    const response = await axios.get(`${API_BRIDGE_PATH}/transactions`, {
      headers,
      params,
    });
    const { resources } = response.data;
    return {
      transactions: resources,
    };
  } catch (error) {
    throw new Error(
      "Erreur lors de la recuperation de la liste des transaction : " +
        error.message
    );
  }
};
