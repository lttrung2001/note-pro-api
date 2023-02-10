import { Router } from "express";
import memberController from '../controllers/memberController'

const memberRouter = () => {
  const router = Router()
  router.post('/add-member', memberController.addMember)
  router.put('/edit-member', memberController.editMember)
  router.delete('/delete-member', memberController.deleteMember)
  router.get('/get-members', memberController.getMembers)
  router.get('/get-member-details', memberController.getMemberDetails)

  return router
}