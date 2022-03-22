import { getSession, isExists, formatPhone } from './../whatsapp.js';
import response from './../response.js'


const checkNumber = async (req, res) => {
    
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)    

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'O número do receptor não existe.')
        } 

        response(res, 200, true, 'Número validado com sucesso.')
        

    } catch {
        response(res, 500, false, 'Falha na consulta do numero.')
    }
}

const checkPicture = async (req, res) => {
    
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)

    try {
        const ppUrl = await session.profilePictureUrl(receiver)

        if (!ppUrl) {
            response(res, 500, false, 'Falha na consulta da imagem.')
        }        

        response(res, 200, true, 'Imagem recebida, por favor salvar a imagem.', { ppUrl })
        

    } catch {
        response(res, 500, false, 'Falha na consulta da imagem.')
    }
}




export { checkNumber, checkPicture }