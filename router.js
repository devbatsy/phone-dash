class uploadRouter{
    constructor(express,mongoose,wss)
    {
        this.router = express.Router();
        this.path = require('path');
        this.body = require('body-parser');
        this.wss = wss;
        this.uploadScoreSchema = require('./uploadScore.js');
        this.urlEncoded = this.body.urlencoded({extended:false})
        try{
            this.userUploadConnection = mongoose.createConnection(process.env.userUploadDataUrl,
                {
                    useUnifiedTopology:true,
                    useNewUrlParser:true
                })
        }catch(err){
            console.log(err.name,' this is an error')
        }

        this.userUploadConnection.once('connected', () =>{
            console.log('connection has been made successfully');
            this.userUploadTemplate = new this.uploadScoreSchema(this.userUploadConnection,mongoose)
            uploadRouter.routeProcess(this)
        })
    }
    static routeProcess(param)
    {
        const {router,path,urlEncoded,userUploadTemplate,wss} = param;
        
        router.get('/', (req,res) =>{
            res.sendFile(path.join(__dirname,'index.html'))
        })
        .post('/saveScore',urlEncoded, (req,res) =>{
            let {username,score} = req.body;
            score = Number(score)
            const uploadData = async () =>{
                const result = await userUploadTemplate.userUpload.create({
                    username:username,
                    maxScore:score
                })
                .then(() =>{
                    console.log('data uploaded successfully');
                    res.send('data uploaded successfully')
                    // let time = setTimeout(() =>{
                    //     res.sendFile(path.join(__dirname,'index.html'));
                    //     clearTimeout(time)
                    // },1000)
                }).catch(err =>{
                    console.log(err)
                })
            }

            const updateData = async() =>{
                const updateResult = await userUploadTemplate.userUpload.updateOne({username:username},{maxScore:score})
                .exec()
                .then(() =>{
                    console.log('data updated successfully');
                    res.send('data updated successfully')
                    // let time = setTimeout(() =>{
                    //     res.sendFile(path.join(__dirname,'index.html'));
                    //     clearTimeout(time)
                    // },1000)
                })
                .catch(err =>{
                    console.log(err)
                })
            }   

            const findUserData = async () =>{
                const findResult = await userUploadTemplate.userUpload.find({},'-_id username').exec()
                .then(data =>{
                    if(data.some(val =>{return val.username === username}))
                    {
                        updateData();
                    }else{
                        uploadData();
                    }
                })
                .catch(err =>{
                    console.log(err)
                })
            }
            if(username.length > 0)
            {
                findUserData()
            }else
            {
                res.send('please enter a username')
            }
        })


        wss.on('connection', ws =>{
            ws.on('message', data =>{
                const refined = JSON.parse(data);

                const rank = (users,playerName) =>{
                    const info = users;
                    const leaderArray = new Array();
                    const returnObject = {
                        leaderBoard:[],
                        playerRank:0,
                        playerScore:0,
                    };
                    
                    for(let i = 0; i < info.length; i++)
                    {
                        let tempObj = {username:'',maxScore:0};
                        for(let j = 0; j < info.length; j++)
                        {
                            if(!leaderArray.includes(info[j]))
                            {
                                if(info[j].maxScore >= tempObj.maxScore)
                                {
                                    tempObj = info[j]
                                }
                            }else continue
                        }
                        leaderArray.push(tempObj)
                    }

                    for(let i = 0; i < leaderArray.length; i++)
                    {
                        if(i < 10)
                        {
                            returnObject.leaderBoard.push(leaderArray[i])
                        }
                    }
                    
                    let playerRankArray = info.filter(val =>{return val.username === playerName});

                    playerRankArray = playerRankArray.length === 0 ? {} : playerRankArray[0];

                    returnObject.playerScore = playerRankArray.maxScore === undefined ? 0 : playerRankArray.maxScore

                    returnObject.playerRank = leaderArray.indexOf(playerRankArray);
                    returnObject.playerRank = returnObject.playerRank === -1 ? 'unset' : returnObject.playerRank + 1;
                    if(returnObject.playerRank === 1)
                    {
                        returnObject.playerRank = '1st'
                    }
                    else if(returnObject.playerRank === 2)
                    {
                        returnObject.playerRank = '2nd'
                    }else if(returnObject.playerRank === 3)
                    {
                        returnObject.playerRank = '3rd'
                    }else if(returnObject.playerRank > 3)
                    {
                        returnObject.playerRank = `${returnObject.playerRank}th`;
                    }
                    return returnObject
                }

                switch(true)
                {
                    case refined.purpose === 'leaderBoard':
                        const findUserData = async () =>{
                            const findResult = await userUploadTemplate.userUpload.find({},'-_id username maxScore').exec()
                            .then(data =>{
                                ws.send(JSON.stringify(rank(data,refined.data)))
                            })
                            .catch(err =>{
                                console.log(err)
                            })
                        }
                        findUserData()
                }
            })
        })
    }
}

module.exports = uploadRouter