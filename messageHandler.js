const { MessageType, Mimetype } = require("@adiwajshing/baileys")

const rooms = []

module.exports = async (conn, message) => {
	const senderNumber = message.key.remoteJid
    const textMessage = message.message.conversation || message.message.extendedTextMessage && message.message.extendedTextMessage.text

    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i]
        if (room[0] == senderNumber || room[1] == senderNumber) {
            if (textMessage == '!stop') {

                rooms.splice(i, 1)
                conn.sendMessage(room[0], '[BOT] Percakapan diakhiri!', MessageType.text)
                if (room[1]) {
                    conn.sendMessage(room[1], '[BOT] Percakapan diakhiri!', MessageType.text)
                }

            } else if (room[0] == senderNumber && !room[1] && textMessage == '!random') {
                conn.sendMessage(senderNumber, '[BOT] Sedang mencari teman chat!', MessageType.text)
            } else if (room[0] == senderNumber && !room[1]) {
                conn.sendMessage(senderNumber, '[BOT] Kamu belum terhubung! kirim *!random* untuk mencari teman chat', MessageType.text)
            } else {
                message.key.fromMe = true
                if (senderNumber == room[0]) {
                    conn.forwardMessage(room[1], message)
                } else {
                    conn.forwardMessage(room[0], message)
                }
            }
            return
        }
    }

    if (textMessage == '!random') {

        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            if (room[0] && !room[1]) {
                room[1] = senderNumber
                conn.sendMessage(room[0], '[BOT] Percakapan ditemukan! sapalah teman barumu!\nKirim *!stop* untuk mengakhiri percakapan', MessageType.text)
                conn.sendMessage(room[1], '[BOT] Percakapan ditemukan! sapalah teman barumu!\nKirim *!stop* untuk mengakhiri percakapan', MessageType.text)
                return
            }
        } 
        rooms.push([senderNumber])
        conn.sendMessage(senderNumber, '[BOT] Mencari teman chat!', MessageType.text)

    } else {
        conn.sendMessage(senderNumber, '[BOT] Kamu belum terhubung! kirim *!random* untuk mencari teman chat', MessageType.text)
    }

}