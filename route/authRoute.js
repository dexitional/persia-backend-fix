var express = require("express");
var Router = express.Router();
const db = require("../config/mysql");
var jwt = require("jsonwebtoken");
const sha1 = require("sha1");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwzyx", 8);

/* Controllers */
var ApplicantController = require("../controller/admission/applicantController");
var SSOController = require("../controller/admission/ssoController");
const { voteLimiter } = require("../middleware/rateLimitter");
const { verifyToken } = require("../middleware/verifyToken");

/* SSO User Photo */
Router.get("/photos", SSOController.fetchPhoto);
Router.get("/photos/evs", SSOController.fetchEvsPhoto);
Router.post("/ssophoto", SSOController.postPhoto);
Router.post("/rotatephoto", SSOController.rotatePhoto);
Router.post("/removephoto", SSOController.removePhoto);
Router.post("/sendphotos", SSOController.sendPhotos);

/* SSO Authentication */
Router.post("/auth/sso", SSOController.authenticateUser);
Router.post("/auth/google", SSOController.authenticateGoogle);

/* SSO Reset */
Router.post("/reset/sendotp", SSOController.sendOtp);
Router.post("/reset/verifyotp", SSOController.verifyOtp);
Router.post("/reset/sendpwd", SSOController.sendPwd);
Router.get("/reset/stageusers", SSOController.stageusers);
Router.get("/reset/testsms", SSOController.testsms);

/* HRS MODULE ROUTES */

// HR Staff routes
Router.get("/hrs/hrstaff/", SSOController.fetchHRStaffDataHRS);
Router.post("/hrs/hrstaff", SSOController.postHRStaffDataHRS);
Router.get("/hrs/stactive", SSOController.fetchActiveStListHRS);
Router.delete("/hrs/hrstaff/:id", SSOController.deleteHRStaffDataHRS);
Router.get("/hrs/hrstaff/:sno", SSOController.fetchHRStaffHRS);
Router.get("/hrs/resetpwd/:staff_no", SSOController.resetAccountHRS);
Router.get("/hrs/genmail/:staff_no", SSOController.generateMailHRS);
Router.get("/hrs/setupaccess/:staff_no", SSOController.stageAccountHRS);
Router.get("/hrs/upgraderole/:uid/:role", SSOController.upgradeRole);
Router.get("/hrs/revokerole/:uid/:role", SSOController.revokeRole);

// HR Unit routes
Router.get("/hrs/hrunit/", SSOController.fetchHRUnitDataHRS);
Router.post("/hrs/hrunit", SSOController.postHRUnitDataHRS);
Router.delete("/hrs/hrunit/:id", SSOController.deleteHRUnitDataHRS);

// HR Job routes
Router.get("/hrs/hrsjob/", SSOController.fetchHRJobData);
Router.post("/hrs/hrsjob", SSOController.postHRJobData);
Router.delete("/hrs/hrsjob/:id", SSOController.deleteHRJobData);

/* EVS MODULE ROUTES */
Router.get("/evs/data/:id", [ verifyToken], SSOController.fetchEvsData); // Tag must be query Parameter
Router.post("/evs/data", [ verifyToken, voteLimiter ], SSOController.postEvsData);
Router.get("/evs/monitor/:id",[ verifyToken], SSOController.fetchEvsMonitor);
Router.get("/evs/result/:id",[ verifyToken], SSOController.fetchEvsMonitor);
Router.get("/evs/receipt/:id/:tag",[ verifyToken], SSOController.fetchEvsReceipt);
Router.get("/evs/register/:id",[ verifyToken], SSOController.fetchEvsRegister);
Router.get("/evs/update/:tag",[ verifyToken], SSOController.fetchEvsUpdate);
Router.post("/evs/setcontrol",[ verifyToken], SSOController.updateEvsControl);
Router.delete("/evs/deletevoter/:id/:tag",[ verifyToken], SSOController.removeVoter);
Router.post("/evs/addvoter",[ verifyToken], SSOController.addVoter);
Router.delete("/evs/deleteportfolio/:id",[ verifyToken], SSOController.removePortfolio);
Router.post("/evs/saveportfolio",[ verifyToken], SSOController.savePortfolio);
Router.delete("/evs/deletecandidate/:id",[ verifyToken], SSOController.removeCandidate);
Router.post("/evs/savecandidate",[ verifyToken], SSOController.saveCandidate);

/* SSO - IDENTITY ROUTES */
Router.get("/sso/identity", SSOController.fetchSSOIdentity);
Router.post("/sso/identity", SSOController.postEvsData);
Router.post("/sso/bulkphoto", SSOController.fetchEvsMonitor);

/* HELPERS */
Router.get("/hrs/helpers", SSOController.fetchHRShelpers);
Router.get("/fms/helpers", SSOController.fetchFMShelpers);
Router.get("/ais/helpers", SSOController.fetchAIShelpers);
Router.get("/ams/helpers", SSOController.fetchAMShelpers);

module.exports = Router;
