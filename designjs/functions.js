import { 
	DomType,
	sydDOM,
	useState,
	sydDiff,
	virtualDom 
} from "../sydneyLib/sydneyDom.js";
import { loadGame, createGameObject, GlobalGameObject, animate } from "../jsFiles/main.js";
let fullScreen = false

const createServerObject = (purpose,data) =>{
    return {
        purpose:purpose,
        data:data
    }
}

const enterFullscreen = () =>{
    switch(true){
        case fullScreen:
            if(document.webkitExitFullscreen){
                document.webkitExitFullscreen();
                fullScreen = false
            }
        break;
        case !fullScreen:
            document.body.requestFullscreen().then(() =>{
                fullScreen = true;
            }).catch(() =>{
                console.log('enabling incomplete')
            })
    }
}

screen = () =>{
    if(!GlobalGameObject.animating) enterFullscreen()
}

runAfterMsg = (data) =>{
    cancelAnimationFrame(loadAnimation)
    sydDiff({
        type:DomType.enterPage,
        oldVApp:sydDOM.enter(useState(DomType.enterPage)),
        newVApp:sydDOM.enter(useState(DomType.enterPage,'new'))
    })
    // createGameObject();

    sydDiff({
        type:DomType.leaderTable,
        oldVApp:sydDOM.leaderTable(),
        newVApp:sydDOM.leaderTable(data.leaderBoard)
    })

    sydDiff({
        type:DomType.rank,
        oldVApp:sydDOM.rank(),
        newVApp:sydDOM.rank(data.playerRank)
    })
    GlobalGameObject.score = data.playerScore
    updateMaxScore()
    
    enterFullscreen();
    bgSong.play()
}

enterGame = () =>{
    iconClick()
    const serverPackage = createServerObject('leaderBoard',useState(DomType.holdUserName,'new').value.toLowerCase())
    const startload = () =>{
        loadAnimation = requestAnimationFrame(startload)
        sydDiff({
            type:DomType.loading,
            oldVApp:sydDOM.loading(useState(DomType.loading).width),
            newVApp:sydDOM.loading(useState(DomType.loading,'new').width)
        })
        if(useState(DomType.loading,'new').width < 100)
        {
            useState(DomType.loading).width = useState(DomType.loading,'new').width;
            useState(DomType.loading,'new').width += 5;
        }
    }
    if(virtualDom[DomType.username].value !== '')
    {
            startload();
            ws.send(JSON.stringify(serverPackage))
    }else{
        alert('please enter a username')
    }
}

editUserName = () =>{
    const text = virtualDom[DomType.username].value;
    useState(DomType.holdUserName).value = useState(DomType.holdUserName,'new').value.toLowerCase();
    useState(DomType.holdUserName,'new').value = text.toLowerCase();
    sydDiff({
        type:DomType.holdUserName,
        oldVApp:sydDOM.holdUserName(useState(DomType.holdUserName).value),
        newVApp:sydDOM.holdUserName(useState(DomType.holdUserName,'new').value)
    })
}


const togPlaySecD = () =>{
    sydDiff({
        type:DomType.playSection,
        oldVApp:sydDOM.playSection(useState(DomType.playSection).d),
        newVApp:sydDOM.playSection(useState(DomType.playSection,'new').d)
    })
    useState(DomType.playSection).d = useState(DomType.playSection,'new').d
    useState(DomType.playSection,'new').d = useState(DomType.playSection,'new').d === 'none' ? 'flex' : 'none'
}

const togMainLeader = () =>{
    sydDiff({
        type:DomType.mainLeader,
        oldVApp:sydDOM.mainLeader(useState(DomType.mainLeader).d),
        newVApp:sydDOM.mainLeader(useState(DomType.mainLeader,'new').d)
    })

    useState(DomType.mainLeader).d = useState(DomType.mainLeader,'new').d
    useState(DomType.mainLeader,'new').d = useState(DomType.mainLeader,'new').d === 'none' ? 'flex' : 'none'
}

const togMainFile = () =>{
    sydDiff({
        type:DomType.submitFile,
        oldVApp:sydDOM.submitFile(useState(DomType.submitFile).d),
        newVApp:sydDOM.submitFile(useState(DomType.submitFile,'new').d)
    })

    useState(DomType.submitFile).d = useState(DomType.submitFile,'new').d
    useState(DomType.submitFile,'new').d = useState(DomType.submitFile,'new').d === 'none' ? 'flex' : 'none'
}

export const updateMaxScore = () =>{
    if(useState(DomType.maxScore).num < GlobalGameObject.score)
    {
        useState(DomType.maxScore).num = GlobalGameObject.score
        sydDiff({
            type:DomType.maxScore,
            oldVApp:sydDOM.maxScore(0),
            newVApp:sydDOM.maxScore(GlobalGameObject.score)
        });

        sydDiff({
            type:DomType.holdScore,
            oldVApp:sydDOM.holdScore(0),
            newVApp:sydDOM.holdScore(GlobalGameObject.score)
        });
    }
}

export const reducePlayerLife = () =>{
    switch(true)
    {
        case useState(DomType.playerLife,'new').live > 0:
            useState(DomType.playerLife).live = virtualDom[DomType.playerLife].childNodes.length-1
            useState(DomType.playerLife,'new').live--;
            sydDiff({
                type:DomType.playerLife,
                oldVApp:sydDOM.playerLife(useState(DomType.playerLife).live),
                newVApp:sydDOM.playerLife(useState(DomType.playerLife,'new').live)
            })
            switch(true)
            {
                case useState(DomType.playerLife,'new').live === 0:
                    updateMaxScore()
                    togPlaySec();
                    togPauseButton();
            }
        break;
    }
}
export const increasePlayerLife = () =>{
    switch(true)
    {
        case useState(DomType.playerLife,'new').live < 2:
            useState(DomType.playerLife).live = virtualDom[DomType.playerLife].childNodes.length-1
            useState(DomType.playerLife,'new').live++;
            sydDiff({
                type:DomType.playerLife,
                oldVApp:sydDOM.playerLife(useState(DomType.playerLife).live),
                newVApp:sydDOM.playerLife(useState(DomType.playerLife,'new').live)
            })
    }

}


togPlaySec = () =>{
    togPlaySecD();
    iconClick();
    GlobalGameObject.animating = GlobalGameObject.animating === false ? true : false;
    switch(true)
    {
        case !GlobalGameObject.animating:
            bgSong.play();
            cancelAnimationFrame(GlobalGameObject.timer);
        break;
        default:
            bgSong.pause();
            animate();
    }
}
export const togPauseButton = ({ignore = false} = {}) =>{
    switch(true)
    {
        case !ignore:
            useState(DomType.pause).d = 'block'
            useState(DomType.pause,'new').d = 'none'
        break;
        default:
            useState(DomType.pause).d = 'none'
            useState(DomType.pause,'new').d = 'block'
    }

    sydDiff({
        type:DomType.pause,
        oldVApp:sydDOM.pause(useState(DomType.pause).d),
        newVApp:sydDOM.pause(useState(DomType.pause,'new').d)
    })
}

export const updateScore = (score = GlobalGameObject.score) =>{
    sydDiff({
        type:DomType.score,
        oldVApp:sydDOM.score(score-1),
        newVApp:sydDOM.score(score)
    })
}

export const updateCoin = (coins = GlobalGameObject.collectCoins) =>{
    sydDiff({
        type:DomType.bitCoins,
        oldVApp:sydDOM.bitCoins(coins-1),
        newVApp:sydDOM.bitCoins(coins),
    })
}

const refillPlayerLife = () =>{
    useState(DomType.playerLife).live = virtualDom[DomType.playerLife].childNodes.length-1;
    useState(DomType.playerLife,'new').live = 2;
    sydDiff({
        type:DomType.playerLife,
        oldVApp:sydDOM.playerLife(useState(DomType.playerLife).live),
        newVApp:sydDOM.playerLife(useState(DomType.playerLife,'new').live)
    })
}

startGame = () =>{
    createGameObject();
    togPlaySecD();
    GlobalGameObject.animating = true;
    animate();
    togPauseButton({ignore:true});
    refillPlayerLife();
    updateScore();
    updateCoin(0);
    bgSong.pause();
}


togBoard = () =>{
    togMainLeader();
    togPlaySecD();
    iconClick()
}

togFile = () =>{
    togMainFile();
    togPlaySecD();
}
let muted = false

mute = () =>{
    iconClick()
    muted = muted === false ? true : false;
    if(!muted)
    {
        bgSong.volume = .2;
        useState(DomType.mute).opacity = useState(DomType.mute,'new').opacity;
        useState(DomType.mute,'new').opacity = '1'

    }else {
        bgSong.volume = 0;
        useState(DomType.mute).opacity = useState(DomType.mute,'new').opacity;
        useState(DomType.mute,'new').opacity = '.4'
    }

    sydDiff({
        type:DomType.mute,
        oldVApp:sydDOM.mute(useState(DomType.mute).opacity),
        newVApp:sydDOM.mute(useState(DomType.mute,'new').opacity)
    })
}

iconClick = () =>{
    new playSound('zipclick.flac')
}