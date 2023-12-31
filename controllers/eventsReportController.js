const db = require("../models/db");
const baptismFields = require("../models/baptismalRegistry");
const dedicationFields = require("../models/infantDedication");
const prenupFields = require("../models/prenupRecord");
const weddingFields = require("../models/weddingRegistry");
const { Condition, queryTypes } = require("../models/condition");
const binningFunction = require("../helpers/binningFunction");

const eventsReportController = {
    /**
     * This function renders the attendance record main page
     * @param req - the incoming request containing either the query or body
     * @param res - the result to be sent out after processing the request
     */
    getCountPerEventData: function (req, res) {
        const startDate = new Date(req.body.startDate).toISOString();
        const endDate = new Date(req.body.endDate).toISOString();
        var data = {};

        if (parseInt(endDate.substring(0,4)) - parseInt(startDate.substring(0,4)) > 20) {
            res.send('ERROR');
            return;
        }
        
        //cond = new Condition(queryTypes.whereBetween)
        //cond.setRange(memberFields.BIRTHDAY, helper.formatDate(data.member.birthdayFrom), helper.formatDateTomorrow(data.member.birthdayTo))

        const withinDateRange = new Condition(queryTypes.whereBetween);
        withinDateRange.setRange(db.tables.BAPTISMAL_TABLE + "." + baptismFields.DATE, startDate, endDate);

        db.find(db.tables.BAPTISMAL_TABLE, [withinDateRange], [], "*", function (result) {
            data.baptisms = result.length;
            withinDateRange.setRange(db.tables.INFANT_TABLE + "." + dedicationFields.DATE, startDate, endDate);

            db.find(db.tables.INFANT_TABLE, [withinDateRange], [], "*", function (result) {
                data.dedications = result.length;
                withinDateRange.setRange(db.tables.PRENUPTIAL_TABLE + "." + prenupFields.DATE, startDate, endDate);

                db.find(db.tables.PRENUPTIAL_TABLE, [withinDateRange], [], "*", function (result) {
                    data.prenups = result.length;
                    withinDateRange.setRange(db.tables.WEDDING_TABLE + "." + weddingFields.DATE, startDate, endDate);
                    
                    db.find(db.tables.WEDDING_TABLE, [withinDateRange], [], "*", function (result) {
                        data.weddingFields = result.length;
                        res.send(data);
                    });
                });
            });
        });
    },
    getCountPerEventDataBinned: function (req, res) {
        const startDate = new Date(req.body.startDate).toISOString();
        const endDate = new Date(req.body.endDate).toISOString();
        var data = {};

        if (parseInt(endDate.substring(0,4)) - parseInt(startDate.substring(0,4)) > 20) {
            res.send('ERROR');
            return;
        }

        const withinDateRange = new Condition(queryTypes.whereBetween);
        withinDateRange.setRange(db.tables.BAPTISMAL_TABLE + "." + baptismFields.DATE, startDate, endDate);

        db.find(db.tables.BAPTISMAL_TABLE, [withinDateRange], [], baptismFields.DATE, function (result) {
            data.baptisms = binningFunction(result, req.body.startDate, req.body.endDate);
            withinDateRange.setRange(db.tables.INFANT_TABLE + "." + dedicationFields.DATE, startDate, endDate);

            db.find(db.tables.INFANT_TABLE, [withinDateRange], [], dedicationFields.DATE, function (result) {
                data.dedications = binningFunction(result, req.body.startDate, req.body.endDate);
                withinDateRange.setRange(db.tables.PRENUPTIAL_TABLE + "." + prenupFields.DATE, startDate, endDate);

                db.find(db.tables.PRENUPTIAL_TABLE, [withinDateRange], [], prenupFields.DATE, function (result) {
                    data.prenups = binningFunction(result, req.body.startDate, req.body.endDate);
                    withinDateRange.setRange(db.tables.WEDDING_TABLE + "." + weddingFields.DATE, startDate, endDate);
                    
                    db.find(db.tables.WEDDING_TABLE, [withinDateRange], [], weddingFields.DATE, function (result) {
                        data.weddings = binningFunction(result, req.body.startDate, req.body.endDate);
                        res.send(data);
                    });
                });
            });
        });
    }
};

module.exports = eventsReportController;
