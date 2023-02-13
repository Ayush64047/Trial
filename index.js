// Implement the WhatApp chatbot
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

// Create an instance of Client which gives access to the whatsapp-web.js functionality.
const client = new Client();

// Register event handler functions for the qr
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

// Initialize & Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Implement runCompletion Function
async function runCompletion(message) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 200,
  });
  return completion.data.choices[0].text;
}

// Generate A Completion And Respond To Messages
client.on("message", (message) => {
  console.log(message.body);

  if (message.body.startsWith("#")) {
    runCompletion(message.body.substring(1)).then((result) =>
      message.reply(result)
    );
  }
});
