import { isSessionExists, createSession, getSession, deleteSession } from './../whatsapp.js'
import response from './../response.js'

const find = (req, res) => {
    if (isSessionExists(req.params.id)) {
        return response(res, 200, true, 'Sessão encontrada.')
    }

    response(res, 404, false, 'Sessão não encontrada.')
}

const add = (req, res) => {
    const { id, isLegacy } = req.body

    if (isSessionExists(id)) {
        return response(res, 409, false, 'A sessão já existe, use outro id.')
    }

    createSession(id, isLegacy === 'true', res)
}

const del = async (req, res) => {
    const { id } = req.params
    const session = getSession(id)

    if (session) {
        try {
            await session.logout()
        } catch {
        } finally {
            deleteSession(id, session.isLegacy)
        }
    }

    response(res, 200, true, 'A sessão foi excluída com sucesso.')
}

export { find, add, del }
