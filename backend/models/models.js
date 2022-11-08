const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orgID = process.env.VITE_OID

console.log("The current OID is:", process.env.VITE_OID)

//Added the Types and ObjectID because OrgID is an ObjectID and this allows us to get the Organization
// But in Event and Primary we convert it to a string through String(req.params.id) when it is being pulled from OrganizationData
//collection for the Organizations
let organizationSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, default: uuid.v1 },
    organizationName: {
        type: String,
        require: true
    }
}, {
    collection: 'organizationData',
    timestamps: true
});

//collection for intakeData
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true
    },
    oid: { 
        type: String,
        default: String(orgID)
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phoneNumbers: {
        type: Array,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    }
}, {
    collection: 'primaryData',
    timestamps: true
});

//collection for eventData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    oid: { 
        type: String,
        require: true,
        default: String(orgID)
    },
    eventName: {
        type: String,
        require: true
    },
    services: {
        type: Array
    },
    date: {
        type: Date,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    description: {
        type: String,
    },
    attendees: [{
        type: String
    }]
}, {
    collection: 'eventData',
    timestamps: true
});

// create models from mongoose schemas
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const organizationData = mongoose.model('organizationData',organizationSchema);

// package the models in an object to export 
module.exports = { primarydata, eventdata, organizationData }
