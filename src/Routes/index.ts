import { Router } from "express";
import { Controller } from "../App/main/controller";

const rootRouter = Router()
// rootRouter
rootRouter
    .get(
        '/rooms',
        Controller.getAllRooms
    )
    .get(
        '/rooms/history',
        Controller.getHistory
    )
    .get(
        '/rooms/:id',
        Controller.getSingleRoom
    )
    .post(
        '/rooms/create',
        Controller.createRoom
    )
    .patch(
        '/rooms/:id',
        Controller.updateRoom
    )
    .delete(
        '/rooms/:id',
        Controller.deleteRoom
    )

export default rootRouter