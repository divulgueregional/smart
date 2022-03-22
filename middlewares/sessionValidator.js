import { isSessionExists } from '../whatsapp.js'
import response from './../response.js'

const validate = (req, res, next) => {
    const sessionId = req.query.id

    if (!isSessionExists(sessionId)) {
        return response(res, 404, false, 'Sessão não encontrada.')
    }

    res.locals.sessionId = sessionId
    next()
}

export default validate
