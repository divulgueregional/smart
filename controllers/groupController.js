import { getSession, getChatList, isExists, sendMessage, formatGroup } from './../whatsapp.js'
import response from './../response.js'

const getList = (req, res) => {
    return response(res, 200, true, '', getChatList(res.locals.sessionId, true))
}

const send = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const receiver = formatGroup(req.body.receiver)
    const { message } = req.body

    try {
        const exists = await isExists(session, receiver, true)

        if (!exists) {
            return response(res, 400, false, 'O grupo não existe.')
        }

        await sendMessage(session, receiver, { text: message })

        response(res, 200, true, 'A mensagem foi enviada com sucesso.')
    } catch {
        response(res, 500, false, 'Falha no envio da mensagem.')
    }
}

export { getList, send }
