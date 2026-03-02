import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const token =
  process.env.YOUR_ACCESS_TOKEN ||
  "EAApKqjH6po8BQ3lsuwZAjRAM8HuMmxsWYSGlhxSh6pmGZAZCjP7eA7ZBZAltByhzVGV77ZCHYT23DSAiQ8Vw673XGbm35AcZAZAgndv52AzigZAQMYwp5rZBLddvWdS8XzFhbmCPLRarWuMEpjhSMmxYMuOWkk44pcV6E7iuv3wGcMhXTPuFVD6nZBtCZCyHhWJZCQlcW70b7k1YcMdaCp9Q26zXssQdkLgcm0ofMkXJqlpZBZCYFFsjtpqddN1sPcgUaxueA42lm0NXr5h3lV9ZA6WmMhhj5DEZD";
const phoneNumberId = 957450120793284;

export async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/957450120793284/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}
