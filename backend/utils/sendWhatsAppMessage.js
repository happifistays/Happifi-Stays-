import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const token =
  "EAAgFuSZB4cjcBQ8uXKNSAyLKugdxGFdvVmRWm7ZCjiC0LJlHXKy6WJPa3D7LTtiK0g8EIK4WBZAHKTNKqwTVsT9x0ZAZCgDQ9AC2i4FvY47zuXWH9YqAxLHwYXUdQZBgvFugdwOPWU6JxBFLGtdxL8l2JPDIGHUkt9YZBExb9VrmWj4UHGyNKY0O0EOCUDN14hQzT9s4HpS15tbuymzPOSDLLF1iuvrabXosPhXiOUZC9DapWeZC41xJ88Lh8Y9BjanoWTYfwEmMNqQFRLXqsY5px6lw78GZBu0aQpb6vcOQZDZD";
const phoneNumberId = 957450120793284;

export async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/1059330167257430/messages`,
      {
        messaging_product: "whatsapp",
        to: "+919526374812",
        type: "template",
        template: {
          name: "booking_confirmation",
          language: { code: "en_US" },
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
