// https://github.com/salismazaya/whatsapp-bot

const fs = require("fs");
const messageHandler = require("./messageHandler.js");
const { WAConnection } = require("@adiwajshing/baileys");

const conn = new WAConnection();
conn.maxCachedMessages = 15;

if (fs.existsSync("login.json")) conn.loadAuthInfo("login.json");

conn.on("chat-update", async (message) => {
	try {
		if (!message.hasNewMessage) return;
		message = message.messages.all()[0];
		if (!message.message || message.participant || message.key.fromMe || message.key && message.key.remoteJid == 'status@broadcast') return;
		if (message.message.ephemeralMessage) {
			message.message = message.message.ephemeralMessage.message;
		}
		
		await messageHandler(conn, message);
	} catch(e) {
		console.log("[ERROR] " + e.message);
		conn.sendMessage(message.key.remoteJid, "[BOT] Terjadi error! coba lagi nanti", "conversation", { quoted: message });
        console.log(e)
    }
});

const start = () => {
	conn.connect()
		.then(() => {
			fs.writeFileSync("login.json", JSON.stringify(conn.base64EncodedAuthInfo()));
			console.log("[OK] Login sukses! kirim !help untuk menampilkan perintah");
		})
		.catch(e => {
			if (fs.existsSync("login.json")) fs.unlinkSync("login.json");
			console.log("[ERROR] Login gagal!");
			conn.clearAuthInfo();
			start();
		});
}

start();