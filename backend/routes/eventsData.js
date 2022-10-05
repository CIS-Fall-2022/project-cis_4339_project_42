const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});


//Michael tried Aggregation to get the chart response in PostMan
//GET Chart by Aggregation (Chart pipeline was provided by https://www.mongodb.com/products/charts)
//Except the date part :)
router.get("/chart", (req, res, next) => { 

  //Holds the aggregation
  const agg = [
      {
        '$match': {
          'date': {
            '$gte': new Date('Thu, 01 Sep 2022 00:00:00 GMT'), 
            '$lte': new Date('Tue, 01 Nov 2022 00:00:00 GMT')
          }
        }
      }, {
        '$addFields': {
          '__alias_0': {
            '$cond': {
              'if': {
                '$isArray': '$attendees'
              }, 
              'then': {
                '$size': '$attendees'
              }, 
              'else': 0
            }
          }
        }
      }, {
        '$addFields': {
          'date': {
            '$cond': {
              'if': {
                '$eq': [
                  {
                    '$type': '$date'
                  }, 'date'
                ]
              }, 
              'then': '$date', 
              'else': null
            }
          }
        }
      }, {
        '$addFields': {
          '__alias_1': {
            'year': {
              '$year': '$date'
            }, 
            'month': {
              '$subtract': [
                {
                  '$month': '$date'
                }, 1
              ]
            }
          }
        }
      }, {
        '$group': {
          '_id': {
            '__alias_1': '$__alias_1', 
            '__alias_2': '$eventName'
          }, 
          '__alias_0': {
            '$sum': '$__alias_0'
          }
        }
      }, {
        '$project': {
          '_id': 0, 
          '__alias_1': '$_id.__alias_1', 
          '__alias_2': '$_id.__alias_2', 
          '__alias_0': 1
        }
      }, {
        '$group': {
          '_id': {
            'x': '$x'
          }, 
          '__grouped_docs': {
            '$push': '$$ROOT'
          }
        }
      }, {
        '$sort': {
          '_id.x.year': 1, 
          '_id.x.month': 1
        }
      }, {
        '$unwind': '$__grouped_docs'
      }
    ];

  //Executes the aggregation with the aggrgation stored in the agg constant, then returns the json data
  eventdata.aggregate(agg).exec((error, data) => {
    if (error) {
        return next(error)
    } else {
        res.json(data)
    }
})
});
   
  
  

//GET all events for an Organization
router.get("/:oid", (req, res, next) => { 
    eventdata.find({oid: String(req.params.oid)}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET single entry by ID in an Organization
router.get("/:oid/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id, oid: String(req.params.oid) }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});


//GET entries based on search query within an Organization
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/:oid", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" }, oid: String(req.params.oid) }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"],
            oid: String(req.params.oid)
        }
    };
    eventdata.find( 
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


//GET events for which a client is signed up to in an Organization
router.get("/client/:oid/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id, oid: String(req.params.oid) }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//Below you will see 2 different types of DELETE
//We did this to help the user since many may not know th Events ID to DELETE

//Method 1
//Delete Event By Event ID
router.get("/delete/:id", (req, res, next) => { 
    eventdata.findByIdAndDelete({ _id: req.params.id}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//Method 2
//Deletes an Event based on the Search
router.delete("/search/:oid", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" }, oid: String(req.params.oid) }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"],
            oid: String(req.params.oid)
        }
    };
    eventdata.findOneAndDelete( 
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

//POST an Event with the given oid from the front end
router.post("/", (req, res, next) => { 
  eventdata.create( 
      req.body,
      (error, data) => { 
          if (error) {
              return next(error);
          } else {
              res.json(data); 
          }
      }
  );
  eventdata.createdAt;
  eventdata.updatedAt;
  eventdata.createdAt instanceof Date;
});

//PUT an Event with the provided id and oid
router.put("/:id/:oid", (req, res, next) => {
  eventdata.findOneAndUpdate(
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


//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed uo
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
            }
        }
    );
    
});

module.exports = router;