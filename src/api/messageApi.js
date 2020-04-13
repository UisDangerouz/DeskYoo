const mongoose = require('mongoose')

const userApi = require('./userApi');

//MESSAGE DATA STRUCTURE
const Channel = require('./models/channel');
const Thread = require('./models/thread');
const Answer = require('./models/answer');

//POPULATE CHANNELS IF NOT FOUND
Channel.countDocuments({}, (err, count) => {
    if(err) throw err;

    if(count == 0) {
        const main = new Channel({text: "Main", followers: 0});
        const kerttuli = new Channel({text: "Kerttuli", followers: 69});
        main.save()
        kerttuli.save()
    }
});

function addSocketHandles(socket) {
    //MESSAGE GETTER API
    socket.on("GETCHANNELSDISPLAYINFO", () => {
        userApi.isLogged(socket).then((user) => {
            if(!user) {
                socket.emit("USERERROR", "Not logged in");
                return;
            }
            Channel.find({}, (err, channels) => {
                if(err) throw err;
                socket.emit("CHANNELSDISPLAYINFO", channels);
            });
        });
    });

    socket.on("GETTHREADSDISPLAYINFO", (channelID) => {
        /*
        if(!userData.isLogged(socket.id)) {
            socket.emit("USERERROR", "Not logged in");
            return;
        }

        console.log(`Channel id ${channelID} ${typeof channelID}`)
        let threadsDisplayInfo = msgData.getThreadsDisplayInfo(channelID);
        if(!threadsDisplayInfo) {
            console.log("ThreadDisplayInfo Request is invalid!")
            return;
        }

        socket.emit("THREADSDISPLAYINFO", threadsDisplayInfo);
        */
    });

    socket.on("GETANSWERSDISPLAYINFO", (IDs) => {
        /*
        if(!userData.isLogged(socket.id)) {
            socket.emit("USERERROR", "Not logged in");
            return;
        }

        if(!Array.isArray(IDs) || IDs.length != 2 || !msgData.threadExists(IDs[0], IDs[1])) {
            console.log("AnswersDisplayInfo Request is invalid!")
            return;
        }

        socket.emit("ANSWERSDISPLAYINFO", msgData.getAnswersDisplayInfo(IDs[0], IDs[1]))
        */
    });

}

module.exports.addSocketHandles = addSocketHandles;