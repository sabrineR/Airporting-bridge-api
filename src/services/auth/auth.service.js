require("dotenv").config();
const axios = require("axios");
exports.getAuthToken = async () => {
  try {
    const { CLIENT_ID, CLIENT_SECRET, EMAIL, PASSWORD, BRIDGE_VERSION,API_BRIDGE_PATH } =
      process.env;
    const url = `${API_BRIDGE_PATH}/authenticate`
    const data = { email: EMAIL, password: PASSWORD };
    const headers = {
      "Client-ID": CLIENT_ID,
      "Client-Secret": CLIENT_SECRET,
      "Bridge-Version": BRIDGE_VERSION,
      "Content-Type": "application/json",
    };
    const response = await axios.post(url, data, { headers });
    const { access_token, expires_at } = response.data;

    if (!access_token || !expires_at) {
      throw new Error(
        "Réponse incorrecte : jeton d'accès ou date d'expiration manquants."
      );
    }
    return { access_token:{
        value:access_token,
        expires_at
    } };
  } catch (error) {
    throw new Error("Erreur lors de l'authentification : " + error.message);
  }
};
