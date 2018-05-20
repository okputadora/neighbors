const db = require('../models')

module.exports = {
  get: () => {
    return new Promise((resolve, reject) => {
      console.log("in message controller")
      db.Message.findAll({})
      .then((messages, err) => {
        console.log("IN here")
        console.log(messages)
        if (messages){
          return resolve(messages);
        }
        reject(err)
      });
    })
  }
}