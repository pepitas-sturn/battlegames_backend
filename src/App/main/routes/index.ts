import { Router } from "express";
import { Controller } from "../controller";

const RoomRouter = Router()

RoomRouter
    .get(
        '',
        Controller.getAllRooms
    )
    .get(
        '/history',
        Controller.getHistory
    )
    .get(
        '/:id',
        Controller.getSingleRoom
    )
    .post(
        '/create',
        Controller.createRoom
    )
    .patch(
        '/:id',
        Controller.updateRoom
    )
    .delete(
        '/:id',
        Controller.deleteRoom
    )

export default RoomRouter