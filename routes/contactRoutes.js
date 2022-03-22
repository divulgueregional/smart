import { Router } from 'express'
import { body, query } from 'express-validator'
import requestValidator from './../middlewares/requestValidator.js'
import sessionValidator from './../middlewares/sessionValidator.js'
import * as controller from './../controllers/contactController.js'


const router = Router()

router.post('/checkNumber', query('id').notEmpty(), body('receiver').notEmpty(), requestValidator, sessionValidator, controller.checkNumber)
router.post('/checkPicture', query('id').notEmpty(), body('receiver').notEmpty(), requestValidator, sessionValidator, controller.checkPicture)

export default router