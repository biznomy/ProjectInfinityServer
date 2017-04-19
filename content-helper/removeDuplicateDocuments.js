var DATABASE = "TWITTER",COLLECTION = "users";

var db = connect('127.0.0.1:27017/'+DATABASE);

print(' *** Connected With '+DATABASE+' Database && '+ COLLECTION +' Collection *** ');

var duplicates = []; 

db.runCommand( {aggregate: COLLECTION, pipeline: [ { $group: { _id: { DUPEFIELD: "$username"}, dups: { "$addToSet": "$_id" }, count: { "$sum": 1 } }}, { $match: { count: { "$gt": 1 }}} ], allowDiskUse: true } )
.result.forEach(function(doc) {
 doc.dups.shift();
 doc.dups.forEach(function(dupId){
  duplicates.push(dupId);
 }) 
}) 

print(' >>> Total Duplicate Documents  == ' + duplicates.length);


db.users.remove({_id:{$in:duplicates}});


print(' >>> Remove All Duplicate Documents');

