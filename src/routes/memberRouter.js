import { Router } from "express";
import memberController from '../controllers/memberController'

const memberRouter = () => {
  const router = Router()
  router.post('/add-member', memberController.addMember)
  router.put('/edit-member', memberController.editMember)
  router.get('/get-member-details', memberController.getMemberDetails)

  return router
}