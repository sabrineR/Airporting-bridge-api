require("dotenv").config();
const axios = require("axios");
const { CLIENT_ID, CLIENT_SECRET, BRIDGE_VERSION, API_BRIDGE_PATH } =
  process.env;
exports.getAccounts = async (itemId, token) => {
  try {
    // Validation des données d'entrée
    if (!itemId || !token) {
      throw new Error("itemId et token sont requis.");
    }

    //Configuration des en-têtes
    const headers = {
      "Client-ID": CLIENT_ID,
      "Client-Secret": CLIENT_SECRET,
      "Bridge-Version": BRIDGE_VERSION,
      Authorization: `Bearer ${token}`,
    };

    // Appel à l'API externe Bridge
    const response = await axios.get(
      `${API_BRIDGE_PATH}/accounts?item_id=${itemId}`,
      { headers }
    );

    // Formatage des résultats
    const result = response.data.resources.map((account) =>
      formatResult(account)
    );
    return result;
  } catch (error) {
    throw new Error(
      "Erreur lors de la recuperation de la liste des comptes : " +
        error.message
    );
  }
};

// Fonction de formatage des résultats
function formatResult(account) {
  return {
    id: account.id,
    name: account.name,
    balance: account.balance,
    status: account.status,
    status_code_info: account.status_code_info,
    status_code_description: account.status_code_description,
    updated_at: account.updated_at,
    type: account.type,
    currency_code: account.currency_code,
    iban: account.iban,
  };
}
