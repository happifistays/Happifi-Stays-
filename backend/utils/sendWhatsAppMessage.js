import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.YOUR_ACCESS_TOKEN;
const phoneNumberId = process.env.YOUR_PHONE_NUMBER_ID;

export async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
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
