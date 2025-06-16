import { Router } from "express";
import { Controller } from "../App/controller";

const rootRouter = Router()
// rootRouter
rootRouter
    .get(
        '/rooms',
        Controller.getAllRooms
    )
    .get(
        '/rooms/:roomId',
        Controller.getSingleRoom
    )
    .post(
        '/rooms/create',
        Controller.createRoom
    )
    .patch(
        '/rooms/:roomId',
        Controller.updateRoom
    )
    .delete(
        '/rooms/:roomId',
        Controller.deleteRoom
    )
    
export default rootRouter