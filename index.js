var PouchDB = require('pouchdb');
var replicationStream = require('pouchdb-replication-stream');
var MemoryStream = require('memorystream');
PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);

var ClaudiaPouchReplicationStream = function(opts){
  // parse options
  var config = {
    url: typeof opts === 'string' ? opts : opts.url,
    dbReq: !!opts.dbReq,
    replicationOpts : opts.replication || {},
    error: opts.error || false
  };

  // return function that fulfills the request
  return function(req){

    var url = config.url;
    // db is passed in the request
    if(config.dbReq){
      url += '/' + req.pathParams;
    }

    // stream db to express response
    var db = new PouchDB(url);
    return db.dump(res, config.replicationOpts)
      .catch(function(err){
        // custom error handler
        if(typeof config.error === 'function'){
          return config.error(err);
        }
        return err;
      });
  };
};

module.exports = ClaudiaPouchReplicationStream;
