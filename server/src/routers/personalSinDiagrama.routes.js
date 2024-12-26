import { Router } from "express";
import { authJwt } from "../middlewares";
import * as personalSinDiagramaCtrl from "../controllers/personalSinDiagrama.controller";

const router = Router();

router.get("/PersonalSinDiagrama", [authJwt.verifyToken], personalSinDiagramaCtrl.getPersonalesSinDiagrama);
router.get("/PersonalSinDiagrama/:id", [authJwt.verifyToken], personalSinDiagramaCtrl.getPersonalSinDiagrama);
router.post(
    "/PersonalSinDiagrama",
    [authJwt.verifyToken, authJwt.isModerator],
    personalSinDiagramaCtrl.createPersonalSinDiagrama
);

router.put(
    "/PersonalSinDiagrama/:legajo",
    [authJwt.verifyToken, authJwt.isModerator],
    personalSinDiagramaCtrl.updatePersonalSinDiagrama
);
router.delete(
    "/PersonalSinDiagrama/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    personalSinDiagramaCtrl.deletePersonalSinDiagramaById
);
router.post(
    "/PersonalSinDiagrama-multiple",
    [authJwt.verifyToken, authJwt.isModerator],
    personalSinDiagramaCtrl.createMultiplePersonalSinDiagrama
);
router.delete(
    "/PersonalSinDiagrama-multiple",
    [authJwt.verifyToken, authJwt.isModerator],
    personalSinDiagramaCtrl.deleteMultiplePersonalSinDiagrama
);
export default router;