import { Router } from "express";
import memberController from '../controllers/memberController'
import { checkAccessToken } from "../middleware/JWT";

const memberRouter = () => {
  const router = Router()
  router.post('/add-member', checkAccessToken, memberController.addMember)
  router.put('/edit-member', checkAccessToken, memberController.editMember)
  router.delete('/delete-member', checkAccessToken, memberController.deleteMember)
  router.get('/get-members', checkAccessToken, memberController.getMembers)
  router.get('/get-member-details', checkAccessToken, memberController.getMemberDetails)

  return router
}

module.exports = memberRouter