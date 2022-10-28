const express = require("express"); 
const { eventNames } = require("process");
const router = express.Router(); 

//importing data model schemas
let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models");
let { organizationData } = require("../models/models");



//We added all the organizations APIs in PrimaryData.JS
//Because our Organization ID and event ID 
//all link to the clients (PrimaryDB)

//GET all organizations
router.get("/oid/", (req, res, next) => { 
    organizationData.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});


/* //Get Single Organization
router.get("/:id", (req, res, next) => { 
    organizationData.find({_id: String(req.params.id) }, (error, data) => {
    //eventdata.find({oid: String(req.params.oid)}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
}); */

//Get Single person
router.get("/id/:id", (req, res, next) => { 
    primarydata.find({_id: String(req.params.id) }, (error, data) => {
    //eventdata.find({oid: String(req.params.oid)}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});





//GET all entries
router.get("/", (req, res, next) => { 
    primarydata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});


//GET all clients in an Organization
router.get("/:oid", (req, res, next) => { 
    primarydata.find( {oid: String(req.params.oid)},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single client by ID in an Organization
router.get(":oid/id/:id", (req, res, next) => {
    primarydata.find( 
        { _id: req.params.id, oid: String(req.params.oid) }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//To delete client by ID
router.get("/delete/:id", (req, res, next) => { 
    primarydata.findByIdAndRemove({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query within an Organization
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
router.get("/search/:oid", (req, res, next) => {  //:oid
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`},
        oid: String(req.params.oid), $options: "i" }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`,
            oid: String(req.params.oid), $options: "i" }
        }
    };
    primarydata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});


//GET events for a single client
//Not entirely sure what this endpoint is for
router.get("/events/:id", (req, res, next) => { 
    
});

//POST a Client with the provided oid from the front end
router.post("/", (req, res, next) => { 
    primarydata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    primarydata.createdAt;
    primarydata.updatedAt;
    primarydata.createdAt instanceof Date;
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id/:oid", (req, res, next) => { 
    primarydata.findOneAndUpdate( 
        { _id: req.params.id, oid: String(req.params.oid) }, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

module.exports = router;