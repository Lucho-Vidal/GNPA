import { Router } from "express";
import { authJwt } from "../middlewares";
import * as itinerarioCtrl from '../controllers/itinerario.controller'

const router = Router();

router.get(
    "/itinerario",
    [authJwt.verifyToken],
    itinerarioCtrl.getItinerarios
);

router.get(
    "/itinerario/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    itinerarioCtrl.getItinerario
);
router.post(
    "/itinerario",
    [authJwt.verifyToken, authJwt.isAdmin],
    itinerarioCtrl.createItinerario
);
router.post(
    '/itinerario/multiple', 
    [authJwt.verifyToken, authJwt.isAdmin],
    itinerarioCtrl.createMultipleItinerario);
router.put(
    "/itinerario/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    itinerarioCtrl.updateItinerario
);
router.delete(
    "/itinerario/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    itinerarioCtrl.deleteItinerario
);
// router.get(
//     "/itinerario-paginado",
//     [authJwt.verifyToken],
//     itinerarioCtrl.getItinerarioPaginado
// );

export default router;