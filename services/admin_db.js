const mongodb = require('mongodb')
const mongoclient = require('mongodb').MongoClient
var url = "mongodb://127.0.0.1:27017"

var db;


function loginStaff (email, password){
    var collection = db.collection("admin")
    var filter = {
        "email" : email,
        "password" : password
    }
    var userdata =  collection.findOne(filter)  //return the 1st matching document from mongodb
    return userdata;   
}

function viewMemdet (res,id){
    var membercollection = db.collection("member")
        var adcollection = db.collection("ad")
        var filter = {
            _id: mongodb.ObjectId(id)
        }
        var filter2 = {
            memberId: id
        }
        membercollection.find(filter).toArray(function (err, result1) {
            if (err) {
                console.log("Error in filtering member coll", err)
                return
            }
            adcollection.find(filter2).toArray(function (err, result2) {
                if (err) {
                    console.log("Error in filtering ad coll", err)
                    return
                }
                res.render("admin_memdet", { title: "Full Member Details", memberData: result1, adData: result2 })
            })
        })
}

function reqdetview (id,res){

        var adcollection = db.collection("ad")
        var membercollection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "memberId": newId
        }
        var adData = null;
        adcollection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("error in fetching data", err)
                return
            }
            result.forEach(element => {
                adData = element
            })
            var memberid = adData.memberId

            var filter2 = {
                "_id": mongodb.ObjectId(memberid)
            }
            var memberData= null
            membercollection.find(filter2).toArray(function (err, result) {
                if (err) {
                    console.log("error in fetching member details", err)
                    return
                }
                result.forEach(element => {
                    memberData = element
                })
                res.render("admin_sendreq", { title: "view", adData: adData, memberData: memberData })
            })
        })
}    

function viewmem (res){
    
        var membercollection = db.collection("member")
        membercollection.find().toArray(function(err, result){
            if(err){
                console.log(err)
                return
            }
            res.render("admin_allmem", {title : "All Members", memberData : result})
        })

    
}




var dbcontroller={

    connection : function(){

        mongoclient.connect(url,function(err, database){
            if(err){
                console.log("error in db connection", err)
                return
            }
            db = database.db("adproject")  
            console.log("db connected : admin server")
        })
    },

    viewads: function (res) {

       
        var adcollection = db.collection("ad")
    
            adcollection.find().sort({ timestamp: -1 }).toArray(function (err, result) {
                if (err) {
                    console.log("Error in fetching all ad det", err)
                    return
                }
                res.render("admin_allads", { title: "All Ads", taskData: result })
            })
        },



    }  
    
   





module.exports = {dbcontroller, loginStaff, viewMemdet,reqdetview, viewmem }