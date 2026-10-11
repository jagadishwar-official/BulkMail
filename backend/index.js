require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { google } = require("googleapis");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(function () {
        console.log("Connected to DB");
    })
    .catch(function (error) {
        console.log("Failed to connect DB:", error.message);
    });

// Configure Gmail API with OAuth 2.0
const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
});

// Send emails
app.post("/sendemail", async function (req, res) {
    console.log("Send email request received");
    console.log("Gmail user configured:", Boolean(process.env.GMAIL_USER));
    try {
        const msg = req.body.msg;
        const emailList = req.body.emailList;

        if (
            typeof msg !== "string" ||
            !msg.trim() ||
            !Array.isArray(emailList) ||
            emailList.length === 0
        ) {
            return res.status(400).json({
                success: false,
                error: "A message and at least one recipient are required.",
            });
        }

        const sender = process.env.GMAIL_USER;

        if (
            !process.env.GMAIL_CLIENT_ID ||
            !process.env.GMAIL_CLIENT_SECRET ||
            !process.env.GMAIL_REFRESH_TOKEN ||
            !sender
        ) {
            return res.status(500).json({
                success: false,
                error: "Gmail API environment variables are missing.",
            });
        }

        for (const email of emailList) {
            console.log("Preparing email for:", email);
            const message = [
                `From: ${sender}`,
                `To: ${email}`,
                "Subject: A message from BulkMail App",
                "MIME-Version: 1.0",
                "Content-Type: text/plain; charset=UTF-8",
                "",
                msg,
            ].join("\r\n");

            const rawMessage = Buffer
                .from(message, "utf8")
                .toString("base64url");
            console.log("Calling Gmail API...");

            await gmail.users.messages.send({
                userId: "me",
                requestBody: {
                    raw: rawMessage,
                },
            });

            console.log("Email sent to", email);
        }

        return res.json({
            success: true,
            message: "Emails sent successfully.",
        });
} catch (error) {
    console.error(
        "Gmail API error:",
        error.response?.data || error.message
    );

    return res.status(500).json({
        success: false,
        error: error.response?.data || error.message,
    });
}})

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log("Server Started on port", PORT);
});
