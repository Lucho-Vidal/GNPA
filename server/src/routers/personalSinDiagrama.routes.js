import { Router } from "express";
import { authJwt } from "../middlewares";
import * as personalSinDiagramaCtrl from "../controllers/personalSinDiagrama.controller";

const router = Router();

router.get("/PersonalSinDiagrama", [authJwt.verifyToken], personalSinDiagramaCtrl.getPersonalesSinDiagrama);
router.get("/PersonalSinDiagrama/:id", [authJwt.verifyToken], personalSinDiagramaCtrl.getPersonalSinDiagrama);
router.get("/PersonalSinDiagramaPorPeriodo/:legajo/:periodo", [authJwt.verifyToken], personalSinDiagramaCtrl.getPersonalSinDiagramaPorLegajoYPeriodo);
router.post(
    "/PersonalSinDiagrama",
    [authJwt.verifyToken, authJwt.isModerator],
    personalSinDiagramaCtrl.createPersonalSinDiagrama
);

router.put(
    "/PersonalSinDiagrama/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    personalSinDiagramaCtrl.updatePersonalSinDiagrama
);
router.delete(
    "/PersonalSinDiagrama/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    personalSinDiagramaCtrl.deletePersonalSinDiagramaById
);
export default router;