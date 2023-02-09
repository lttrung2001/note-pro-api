import { Router } from "express";
import memberController from '../controllers/memberController'

const memberRouter = () => {
  const router = Router()
  router.post('/add-member', memberController.addMember)
  router.get('/get-member-details', memberController.getMemberDetails)

  return router
}