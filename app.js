
// $( document ).ready(function() {
//     console.log( "ready!" );
// });

let current = {
    id: '',
    hand: false
}

function showEvent(e) { console.log('callFrame event', e) }

async function start() {

    let room = { url: "https://reina.daily.co/raise-hand-demo" };

    // create a video call iframe and add it to document.body
    // defaults to floating window in the lower right-hand corner
    // alternatively you could create iframe in index.html and then wrap it
    //
    window.callFrame = window.DailyIframe.createFrame(); //constructor
    window.callFrame.join({ url: room.url, showLeaveButton: true }); //top level props



    // initialize user view: hand status button and prepare participant list
    //
    document.querySelector(".hand-section").classList.toggle("hide");
    document.querySelector(".guest-section").classList.toggle("hide");
    document.querySelector(".start button").classList.toggle("hide"); // uncomment before pushing


    // useful for debugging/learning purposes
    //
    callFrame.on('loaded', showEvent)
    .on('started-camera', showEvent)
    .on('camera-error', showEvent)
    .on('joining-meeting', showEvent)
    .on('error', showEvent)
    .on('joined-meeting', updateParticipantView)
    .on('participant-joined', updateParticipantView)
    .on('participant-updated', showEvent)
    .on('participant-left', deleteParticipant)
    .on('left-meeting', destroy)
    .on('app-message', msg);
}


async function changeHandState(id, hand){

    let tempid, temphand;

    console.log(current);
    console.log(id == undefined);
    console.log(hand == undefined);

    if (id == undefined){
        tempid = current.id;
        temphand = current.hand;
        callFrame.sendAppMessage(current);
        current.hand = !current.hand;
    }
    else {
        tempid = id;
        temphand = hand;
    }


    let update = document.querySelector("#meeting-participants-info #hand-" + tempid);
    console.log(update);

    if (hand){
        update.innerHTML = temphand;
    }
    else {
        update.innerHTML = temphand;
    }
}



async function updateParticipantView (e) {
    console.log(showEvent(e))
    switch (e.action) {
        case 'joined-meeting' :
            let temp = callFrame.participants().local.user_id;
            addParticipant(temp, 'local');
            current.id = temp;
        case 'participant-joined' :
            addParticipant(e.participant.user_id, 'participant');
            callFrame.sendAppMessage(current);
        }
}


async function addParticipant(id, role) {
    let infoList = document.getElementById('meeting-participants-info');

    // upon join default is hand down
    // added border styling- easier to look at
    let infoEl =
    `<div style="border-style: dotted; padding: 10px; margin:10px;" id="who-${id}">
        <p class="type">${role}</p>
        <p class="hand" id="hand-${id}">false</p>
    </div>`;
    infoList.innerHTML += infoEl;
}

async function msg (e){
    // the most difficult part about this feature is
    // that you have to create a way to share variable states between
    // all possible room connections.
    // the way we do this is by communicating via 'app-mesage'.
    // without  this event it becomes pretty difficult
    // to share variable states between session participants
    changeHandState(e.data.id, e.data.hand);
}

async function deleteParticipant (e) {
    let this_id = e.participant.user_id;
    document.getElementById('who-' + this_id).remove();
}

function destroy(){
    document.querySelector(".main-section").classList.toggle("hide");
    document.querySelector(".start-button").classList.toggle("hide");
    document.querySelector(".destroy-view").classList.toggle("hide");
    callFrame.destroy();

}

