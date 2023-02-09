import { Router } from "express";
import memberController from '../controllers/memberController'

const memberRouter = () => {
  const router = Router()
  router.get('/get-member-details', memberController.getMemberDetails)

  return router
}