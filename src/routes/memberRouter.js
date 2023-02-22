import { Router } from "express";
import memberController from '../controllers/memberController'
import middlewares from '../middlewares'
const router = Router()
router.post('/add-member', middlewares.verifyAccessToken, memberController.addMember)
router.put('/edit-member', middlewares.verifyAccessToken, memberController.editMember)
router.delete('/delete-member', middlewares.verifyAccessToken, memberController.deleteMember)
router.get('/get-members', middlewares.verifyAccessToken, memberController.getMembers)
router.get('/get-member-details', middlewares.verifyAccessToken, memberController.getMemberDetails)

export default router