import { getSession, getChatList, isExists, sendMessage, formatPhone } from './../whatsapp.js';
import response from './../response.js'
import fs from 'fs';

const getList = (req, res) => {
    return response(res, 200, true, '', getChatList(res.locals.sessionId))
}

const send = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)
    const { message } = req.body

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'O número do receptor não existe.')
        }

        await sendMessage(session, receiver, { text: message })

        response(res, 200, true, 'A mensagem foi enviada com sucesso.')
    } catch {
        response(res, 500, false, 'Falha no envio da mensagem.')
    }
}

const sendImage = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)
    const { message, fileurl } = req.body
    
    try {
        const exists = await isExists(session, receiver)
    
        if (!exists) {
            return response(res, 400, false, 'O número do receptor não existe.')
        }
        const imagasend={
             caption: message,
             image: {
              url: fileurl,
             }
        }
        
    await sendMessage(session, receiver, imagasend)
    
        response(res, 200, true, 'A mensagem foi enviada com sucesso.')
    } catch {
        response(res, 500, false, 'Falha no envio da mensagem.')
    }
}

const sendFile = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)

    const { message, fileurl, nomeArquivo } = req.body
    
    try {
        const exists = await isExists(session, receiver)
    
        if (!exists) {
            return response(res, 400, false, 'O número do receptor não existe.')
        }
        const filesend={
             caption: message,
             document: {
              url: fileurl,
             },
             fileName: nomeArquivo,
        }
        
    await sendMessage(session, receiver, filesend)
    
        response(res, 200, true, 'A mensagem foi enviada com sucesso.')
    } catch {
        response(res, 500, false, 'Falha no envio da mensagem.')
    }
}


const sendBulk = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const errors = []

    for (const [key, data] of req.body.entries()) {
        if (!data.receiver || !data.message) {
            errors.push(key)

            continue
        }

        data.receiver = formatPhone(data.receiver)

        try {
            const exists = await isExists(session, data.receiver)

            if (!exists) {
                errors.push(key)

                continue
            }

            await sendMessage(session, data.receiver, { text: data.message })
        } catch {
            errors.push(key)
        }
    }

    if (errors.length === 0) {
        return response(res, 200, true, 'Todas as mensagens foram enviadas com sucesso.')
    }

    const isAllFailed = errors.length === req.body.length

    response(
        res,
        isAllFailed ? 500 : 200,
        !isAllFailed,
        isAllFailed ? 'Falha ao enviar todas as mensagens.' : 'Algumas mensagens foram enviadas com sucesso.',
        { errors }
    )
}


export { getList, send, sendImage, sendFile, sendBulk }
