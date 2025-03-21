import { Router } from "express";
import { Controller } from "../App/controller";

const rootRouter = Router()
// rootRouter
rootRouter
    .get(
        '/',
        Controller.getAllRooms
    )
    .get(
        '/:roomId',
        Controller.getSingleRoom
    )
    .post(
        '/',
        Controller.createRoom
    )
    .put(
        '/:roomId',
        Controller.updateRoom
    )
    .delete(
        '/:roomId',
        Controller.deleteRoom
    )
    
export default rootRouter