const filter = ({xpos},{width},id) =>{
    if(xpos < width)
    {
        return true
    }else return false
}

const effRender = ({parent,speed,canvas,invalidParticle = []}) =>{
    const renderable = new Array();
    for(let elem of parent)
    {
        let shouldBreak;
        if(elem.xpos+elem.width >= (0-speed))
        {
            if(filter(elem,canvas,parent.indexOf(elem)))
            {
                if(!invalidParticle.includes(parent.indexOf(elem)))
                {
                    renderable.push(elem)
                }
            }else{
                shouldBreak = true
            }
        }else {continue};

        if(shouldBreak)
        {
            break;
        }
    }
    return renderable
}

class playerClass{
    constructor(gameObject)
    {
        let canvas = gameObject.canvas;
        let context = gameObject.context
        let base = gameObject.base
        this.xpos = 50;
        this.base = base
        this.height = canvas.height*(8/100);
        this.height = this.height > 60 ? 60 : this.height;
        this.height = this.height < 40 ? 40 : this.height
        this.ypos = base-this.height;
        this.width = this.height;
        this.jumpSpeed = 12*gameObject.rate;//12
        this.fallSpeed = 12*gameObject.rate;//12
        this.jumpMax = canvas.height - (canvas.height*(25/100)) - (canvas.height-this.base+this.height);
        this.jumpMax = this.jumpMax > 400 ? 400 : this.jumpMax;
        this.jumping = false;
        this.falling = false;
        this.freeFallDelay = 5;
        this.ground = base-this.height;
        this.atGround = true;
        this.rate = 0.01;
        this.deRate = 0.02
        this.incremental = 1;
        this.store = 8;
        this.invulnerable = false;
        this.vulnerabilityCount = 0;
        this.invulnerableLimit = 60*5;
        this.playerImage = new Image();
        this.playerImage.src = '../images/assets/phone.png';
        
        this.checkVulnerable = () =>{
            if(this.invulnerable)
            {
                this.vulnerabilityCount++;
                if(this.vulnerabilityCount > this.invulnerableLimit)
                {
                    this.vulnerabilityCount = 0;
                    this.invulnerable = false
                }
            }
        }

        this.render = (context) =>{
            context.beginPath();
            context.globalCompositeOperation = 'destination-over';
            context.drawImage(this.playerImage,this.xpos,this.ypos,this.width,this.height);
            context.globalAlpha = .4;
            context.fillStyle = 'green'
            context.fillRect(this.xpos,this.ypos,this.width,this.height);
            context.globalAlpha = 1;
            context.closePath();
            context.globalCompositeOperation = 'source-over';
        }

        this.noCollision = () =>{
            this.falling = true;
        }

        this.onStakeCollision = (particleY) =>{
            this.falling = false;
            this.base = particleY;
            this.ypos = particleY-this.height+1;
            this.jumpMax = (particleY-this.height);
            this.jumpMax = this.jumpMax > 200 ? 200 : this.jumpMax;
            this.incremental = 1;
        }

        this.bottomCollision = (newypos) =>{
            this.jumping = false;
            this.falling = true;
            this.ypos = newypos;
        }

        this.accelerationModule = () =>{
            switch(true)
            {
                case this.jumping:
                    if(this.incremental > 0.4)
                    {
                        this.incremental -= this.rate;
                    }
                break;
                case this.falling:
                    if(this.incremental < 1)
                    {
                        this.incremental += this.deRate;
                    }

            }
        }

        this.updateGamePlayer = () =>{
            this.accelerationModule();
            this.checkVulnerable();
            switch(true)
            {
                case this.jumping:
                    this.atGround = false;
                            this.ypos -= (this.jumpSpeed*this.incremental)
                    switch(true){
                        case this.base-this.height - this.ypos >= this.jumpMax:
                                    this.jumping = false;
                                    this.falling = true;
                                    this.ypos = this.base - this.height - this.jumpMax;
                                    this.incremental = 0.4
                    }
                break;
                case this.falling:
                    this.ypos += (this.fallSpeed*this.incremental);
                    switch(true)
                    {
                        case this.ypos >= this.ground:
                            this.atGround = true
                            this.falling = false;
                            this.ypos = this.ground;
                            this.base = this.ground;
                            this.jumpMax = canvas.height - (canvas.height*(35/100)) - (canvas.height-this.base+this.height);
                            this.incremental = 1;
                            gameObject.wallCollision = false;
                    }
            }
        }
    }
};

const loadHeartImage = () =>{
    const image = new Image();
    image.src = '../images/assets/heart.png';
    return image
}

class heart{
    constructor(start,width,height,player,cheight,cameraSpeed)
    {
        this.start = start
        this.xpos = Math.round(Math.random()*((width+this.start)-this.start)+this.start);
        this.height = cheight*(8/100);
        this.height = this.height > 60 ? 60 : this.height;
        this.height = this.height < 40 ? 40 : this.height
        this.ypos = height-this.height;
        this.width = this.height;
        this.cameraSpeed = cameraSpeed;
        this.renderHeart = (context) =>{
            context.beginPath();
            // context.fillStyle = 'green';
            context.drawImage(loadHeartImage(),this.xpos,this.ypos,this.width,this.height);
            context.closePath();
        }
        this.updateHeartPos = ({speed,player}) =>{
            this.xpos -= speed;
            this.cameraView(player)
        }
        this.cameraView = (player) =>{
            switch(true)
            {
                case player.jumping:
                    this.ypos += this.cameraSpeed
                break;
                case player.falling:
                    if(this.ypos > height-this.height) this.ypos -= this.cameraSpeed
                break;
                case !player.jumping && !player.falling:
                    if(this.ypos > height-this.height+cameraSpeed) this.ypos -= cameraSpeed;
                    else this.ypos = height-this.height
            }
        }
    }
}

const loadBoostImage = () =>{
    const image = new Image();
    image.src = '../images/assets/boost.png';
    return image
}

class boost{
    constructor(start,width,height,player,cheight,cameraSpeed)
    {
        this.start = start
        this.xpos = Math.round(Math.random()*((width+this.start)-this.start)+this.start);
        this.height = cheight*(8/100);
        this.height = this.height > 60 ? 60 : this.height;
        this.height = this.height < 40 ? 40 : this.height
        this.ypos = height-this.height;
        this.width = this.height;
        this.cameraSpeed = cameraSpeed;
        this.renderBoost = (context) =>{
            context.beginPath();
            // context.fillStyle = 'purple';
            context.drawImage(loadBoostImage(),this.xpos,this.ypos,this.width,this.height);
            context.closePath();
        }
        this.updateBoostPos = ({speed,player}) =>{
            this.xpos -= speed;
            this.cameraView(player)
        }
        this.cameraView = (player) =>{
            switch(true)
            {
                case player.jumping:
                    this.ypos += this.cameraSpeed
                break;
                case player.falling:
                    if(this.ypos > height-this.height) this.ypos -= this.cameraSpeed
                break;
                case !player.jumping && !player.falling:
                    if(this.ypos > height-this.height+cameraSpeed) this.ypos -= cameraSpeed;
                    else this.ypos = height-this.height
            }
        }
    }
}
const enemyImages = () =>{
    let laptop = new Image();
    laptop.src = '../images/assets/enem1.png';
    let calender = new Image();
    calender.src = '../images/assets/enem2.png';
    let calc = new Image();
    calc.src = '../images/assets/enem3.png';
    return [laptop,calender,calc]
}

class enemy{
    constructor(start,width,height,player,cheight,cameraSpeed)
    {
        this.start = start;
        this.image = enemyImages()[Math.round(Math.random()*2)];
        this.xpos = Math.round(Math.random()*((width+this.start)-this.start)+this.start);
        this.height = cheight*(8/100);
        this.height = this.height > 60 ? 60 : this.height;
        this.height = this.height < 40 ? 40 : this.height
        this.ypos = height-this.height;
        this.width = this.height;
        this.cameraSpeed = cameraSpeed;
        this.renderEnemy = (context) =>{
            context.beginPath();
            // context.fillStyle = 'red';
            context.drawImage(this.image,this.xpos,this.ypos,this.width,this.height);
            context.globalAlpha = .4;
            context.fillStyle = 'red'
            context.fillRect(this.xpos,this.ypos,this.width,this.height);
            context.globalAlpha = 1;
            context.closePath();
        }
        this.updateEnemyPos = ({speed,player}) =>{
            this.xpos -= speed;
            this.cameraView(player)
        }
        this.cameraView = (player) =>{
            switch(true)
            {
                case player.jumping:
                    this.ypos += this.cameraSpeed
                break;
                case player.falling:
                    if(this.ypos > height-this.height) this.ypos -= this.cameraSpeed
                break;
                case !player.jumping && !player.falling:
                    if(this.ypos > height-this.height+cameraSpeed) this.ypos -= cameraSpeed;
                    else this.ypos = height-this.height
            }
        }
    }
}
const coinImage = () =>{
    const image = new Image();
    image.src = '../images/assets/coin.png';
    return image
}

class coin{
    constructor(start,width,height,player,cHeight,cameraSpeed)
    {
        this.radius = cHeight*(8/200);
        this.image = coinImage()
        this.radius = this.radius > 40 ? 40 : this.radius;
        this.radius = this.radius < 20 ? 20 : this.radius;
        this.height = this.radius*2;
        this.width = this.radius*2;
        this.start = start+player.xpos+player.width
        this.xpos = Math.round(Math.random()*((width+this.start)-this.start)+this.start);
        this.ypos = height-this.height;
        this.visible = true;
        this.cameraSpeed = cameraSpeed;

        this.render = (context) =>{
            switch(true)
            {
                case this.visible:
                    context.beginPath();
                    // context.fillStyle = 'gold';
                    context.drawImage(this.image,this.xpos,this.ypos,this.width,this.height);
                    context.fill()
                    context.closePath();
            }
        }

        this.updateCoinPos = ({speed,player}) =>{
            this.xpos -= speed;
            this.cameraView(player)
        }

        this.cameraView = (player) =>{
            switch(true)
            {
                case player.jumping:
                    this.ypos += this.cameraSpeed
                break;
                case player.falling:
                    if(this.ypos > height-this.height) this.ypos -= this.cameraSpeed
                break;
                case !player.jumping && !player.falling:
                    if(this.ypos > height-this.height+cameraSpeed) this.ypos -= cameraSpeed;
                    else this.ypos = height-this.height
            }
        }
    }
}

class floor{
    constructor(xpos,{width,height},base,coins,floorEnemies,floorHearts,floorBoosts,player,indexNumber,floorSize,cameraSpeed)
    {
        this.xpos = xpos;
        this.width = width;
        this.ypos = base;
        this.height = height - base;
        this.elemStart = this.xpos+player.xpos+player.width+300;
        this.probationValue = floorSize*2;
        this.indexNumber = indexNumber+1;
        this.lowerLimit = 0.5-(this.indexNumber/this.probationValue);
        this.cameraSpeed = cameraSpeed

        this.render = (context) =>{
            context.beginPath();
            context.fillStyle = '#171717';
            context.fillRect(this.xpos,this.ypos,this.width,this.height);
            context.closePath();
        }
        this.updateFloorPos = ({speed,player}) =>{
            this.xpos -= speed;
            this.cameraView(player)
        }

        this.createCoins = () =>{
            const randomNumber = Math.round(Math.random()*(2-1)+1);
            let x = 0;
            let y = 0;
            for(let i = 0; i < randomNumber; i++)
            {
                const probabilty = Math.random()*(1-this.lowerLimit)+this.lowerLimit;
                switch(true)
                {
                    case  probabilty < 0.6:
                        //create enemy
                        const enemyElement = new enemy(this.elemStart,Math.floor(this.width/5),this.ypos,player,height,this.cameraSpeed);
                        floorEnemies.floorEnemies.push(enemyElement)
                        this.elemStart = enemyElement.xpos+enemyElement.width;
                    break;
                    // case probabilty >= 0.8 && probabilty < 1:
                    //     const powerUpProbation = Math.round(Math.random()*1);
                    //     switch(true)
                    //     {
                    //         case powerUpProbation === 0:
                    //             const heartElement = new heart(this.elemStart,Math.floor(this.width/3),this.ypos,player,height,this.cameraSpeed);
                    //             floorHearts.floorHearts.push(heartElement);
                    //             this.elemStart = heartElement.xpos+heartElement.width;
                    //         break;
                    //         case powerUpProbation === 1:
                    //             const boostElement = new boost(this.elemStart,Math.floor(this.width/3),this.ypos,player,height,this.cameraSpeed);
                    //             floorBoosts.floorBoosts.push(boostElement);
                    //             this.elemStart = boostElement.xpos+boostElement.width;
                    //     }
                    // break
                    case probabilty >= 0.6:
                       //create a coin
                       const coinElement = new coin(this.elemStart,Math.floor(this.width/4),this.ypos,player,height,this.cameraSpeed);
                       coins.floorCoins.push(coinElement)
                       this.elemStart = coinElement.xpos+coinElement.width;
                }

                // const coinElement = new coin(this.coinStart,Math.floor(this.width/2.5),this.ypos,player)
                // this.coinStart = coinElement.xpos;
                // coins.coins.push(coinElement)
            }

            this.cameraView = (player) =>{
                switch(true)
                {
                    case player.jumping:
                        this.ypos += this.cameraSpeed
                    break;
                    case player.falling:
                        if(this.ypos > base)
                        {
                            this.ypos -= this.cameraSpeed
                        }
                    break;
                    case !player.jumping && !player.falling:
                        if(this.ypos > base+cameraSpeed) this.ypos -= cameraSpeed;
                        else this.ypos = base
                }
            }
        }
        this.createCoins()
    }
}


class floorsCreator{
    constructor({floorSize,canvas,base,speed,floorCoins,floorEnemies,floorHearts,floorBoosts,player,cameraSpeed})
    {
        this.prevX = 0;
        this.floor = new Array();
        this.invalidParticle = new Array();
        // this.road = new Image();
        // this.road.src = '../images/nRoad.jpg'
        for(let i = 0; i < floorSize;i++)
        {
            const floorElement = new floor(this.prevX,canvas,base,floorCoins,floorEnemies,floorHearts,floorBoosts,player,i,floorSize,cameraSpeed);
            this.floor.push(floorElement)
            this.prevX = floorElement.xpos + floorElement.width;
        }
        this.render = ({context}) =>{
            const renderable = effRender({parent:this.floor,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.render(context)
            })
            return renderable;
        }
        this.update = (GameObject) =>{
            for(let floor of this.floor)
            {
                floor.updateFloorPos(GameObject)
            }
        }
    }
}

class floorCoinsClass{
    constructor()
    {
        this.floorCoins = new Array;
        this.invalidParticle = new Array();
        this.render = ({context,canvas,speed}) =>{
            const renderable = effRender({parent:this.floorCoins,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.render(context)
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let coin of this.floorCoins)
            {
                coin.updateCoinPos(GameObject)
            }
        }
    }
}

class floatCoinsClass{
    constructor()
    {
        this.floatCoins = new Array;
        this.invalidParticle = new Array();
        this.render = ({context,canvas,speed}) =>{
            const renderable = effRender({parent:this.floatCoins,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.render(context)
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let coin of this.floatCoins)
            {
                coin.updateCoinPos(GameObject)
            }
        }
    }
}

class stake{
    constructor(xpos,{height,width},coins,floatEnemies,floatHearts,floatBoosts,player,wOPtions,hOptions,floorSize,indexNumber,cameraSpeed)
    {
        this.xpos = xpos;
        this.height = height*(15/100);
        // switch(true)
        // {
        //     case height < 300:
                this.height = 18;
        // }
        this.width = wOPtions[Math.round(Math.random()*2)];
        this.prime = hOptions[Math.round(Math.random()*1)];
        this.ypos = this.prime
        this.elemStart = this.xpos;
        this.probationValue = floorSize*2;
        this.indexNumber = indexNumber+1;
        this.lowerLimit = 0.5-(this.indexNumber/this.probationValue);
        this.cameraSpeed = cameraSpeed;

        this.renderStakePos = (context) =>{
            context.beginPath();
            context.fillStyle = '#333'
            context.fillRect(this.xpos,this.ypos,this.width,this.height);
            context.closePath();
        }
        this.updateStakePos = ({speed,player}) =>{
            this.xpos -= speed
            this.cameraView(player)
        }

        this.createCoins = () =>{
            const randomNumber = Math.round(Math.random()*(2-1)+1);

            for(let i = 0; i < randomNumber; i++)
            {
                const probablilty = Math.random()*(1-this.lowerLimit)+this.lowerLimit;
                switch(true)
                {
                    case  probablilty < 0.6:
                        // create an enemy
                        const enemyElement = new enemy(this.elemStart,Math.floor(this.width/3),this.ypos,player,height,this.cameraSpeed);
                        floatEnemies.floatEnemies.push(enemyElement)
                        this.elemStart = enemyElement.xpos+enemyElement.width;
                    break;
                    // case probablilty >= 0.8 && probablilty < 1:
                    //     const powerUpProbation = Math.round(Math.random()*1);
                    //     switch(true)
                    //     {
                    //         case powerUpProbation === 0:
                    //             const heartElement = new heart(this.elemStart,Math.floor(this.width/3),this.ypos,player,height,this.cameraSpeed);
                    //             floatHearts.floatHearts.push(heartElement);
                    //             this.elemStart = heartElement.xpos+heartElement.width;
                    //         break;
                    //         case powerUpProbation === 1:
                    //             const boostElement = new boost(this.elemStart,Math.floor(this.width/3),this.ypos,player,height,this.cameraSpeed);
                    //             floatBoosts.floatBoosts.push(boostElement);
                    //             this.elemStart = boostElement.xpos+boostElement.width;
                    //     }
                    // break;

                    case probablilty >= 0.6:
                        // console.log('create coin')
                        const coinElement = new coin(this.elemStart,Math.floor(this.width/3),this.ypos,player,height,this.cameraSpeed);
                        coins.floatCoins.push(coinElement)
                        this.elemStart = coinElement.xpos+coinElement.width;
                }
            }
        }
        this.createCoins()

        this.cameraView = (player) =>{
            switch(true)
            {
                case player.jumping:
                    this.ypos += this.cameraSpeed
                break;
                case player.falling:
                    if(this.ypos > this.prime)
                    {
                        this.ypos -= this.cameraSpeed
                    }
                break;
                case !player.jumping && !player.falling:
                    if(this.ypos > this.prime+cameraSpeed) this.ypos -= cameraSpeed;
                    else this.ypos = this.prime
            }
        }
    }
}

class stakesCreator{
    constructor({canvas,floorSize,floatCoins,floatEnemies,floatHearts,floatBoosts,player,cameraSpeed})
    {
        this.initpos = canvas.width*(50/100);
        this.randomGap = [400,100]
        this.prevX = Math.floor(Math.random()*(canvas.width - this.initpos)+this.initpos);
        this.stakes = new Array();
        this.widthOpt = [canvas.width*(1/3),canvas.width*(2/3),canvas.width*(1/2)];
        this.heightOpt = [canvas.height*(45/100),canvas.height*(45/100)+(canvas.height*(10/100))];

        for(let i = 0; i < floorSize; i++)
        {
            const stakeElement = new stake(this.prevX,canvas,floatCoins,floatEnemies,floatHearts,floatBoosts,player,this.widthOpt,this.heightOpt,floorSize,i,cameraSpeed);
            this.prevX = stakeElement.xpos+stakeElement.width+(player.width*2)+Math.floor(Math.random()*(this.randomGap[0]-this.randomGap[1])+this.randomGap[1]);

            this.stakes.push(stakeElement)
        }

        this.render = ({context,speed}) =>{
            const renderable = effRender({parent:this.stakes,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.renderStakePos(context)
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let stake of this.stakes){
                stake.updateStakePos(GameObject)
            }
        }

    }
}

class floatEnemiesClass{
    constructor()
    {
        this.floatEnemies = new Array();
        this.invalidParticle = new Array();
        this.render = ({context,canvas,speed}) =>{
            const renderable = effRender({parent:this.floatEnemies,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.renderEnemy(context)
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let enemy of this.floatEnemies)
            {
                enemy.updateEnemyPos(GameObject)
            }
        }
    }
}

class floorEnemiesClass{
    constructor()
    {
        this.floorEnemies = new Array();
        this.invalidParticle = new Array();
        this.render = ({context,canvas,speed}) =>{
            const renderable = effRender({parent:this.floorEnemies,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.renderEnemy(context)
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let enemy of this.floorEnemies)
            {
                enemy.updateEnemyPos(GameObject)
            }
        }
    }
}

//clouds Section



class cs{
    constructor()
    {
        this.array = new Array();
        this.fill = () =>{
            for(let i = 0; i < 5; i++)
            {
                const img = new Image();
                img.src = `/images/useClouds/cs${i+1}.png`;
                this.array.push(img)
            }
        }
        this.fill()
    }
}

class cl{
    constructor()
    {
        this.array = new Array();
        this.fill = () =>{
            for(let i = 0; i < 5; i++)
            {
                const img = new Image();
                img.src = `/images/useClouds/cl${i+1}.png`;
                this.array.push(img)
            }
        }
        this.fill()
    }
}

class cb{
    constructor()
    {
        this.array = new Array();
        this.fill = () =>{
            for(let i = 0; i < 5; i++)
            {
                const img = new Image();
                img.src = `/images/useClouds/cb${i+1}.png`;
                this.array.push(img)
            }
        }
        this.fill()
    }
}

class cloud{
    constructor(start,yRange,size,images,canvas,cameraSpeed)
    {
        this.imageFolderSelect = Object.entries(images)[Math.round(Math.random()*2)][1];
        this.dimension = {W:this.imageFolderSelect.dim[0],H:this.imageFolderSelect.dim[1]}
        this.imageFile = this.imageFolderSelect.img[Math.round(Math.random()*4)]
        this.xpos = start;
        this.size = size[Math.round(Math.random()*(size.length-1))];
        this.selectionPercentage = ((canvas.height*(this.size/100))/this.dimension.H);
        this.width = this.dimension.W*this.selectionPercentage;
        this.height = this.dimension.H*this.selectionPercentage;
        this.primeY = Math.round(Math.random()*(yRange[0]-yRange[1])+yRange[1]);
        this.ypos = this.primeY;
        this.cameraSpeed = cameraSpeed;                         
        
        this.renderCloud = (context) =>{
            context.globalAlpha = 0.6
            context.beginPath();
            context.drawImage(this.imageFile,this.xpos,this.ypos,this.width,this.height)
            context.globalAlpha = 1
            context.closePath();
        }

        this.updateCloudPos = ({speed,player}) =>{
            this.xpos -= speed
            this.cameraView(player)
        }

        this.cameraView = (player) =>{
            switch(true)
            {
                case player.jumping:
                    this.ypos += this.cameraSpeed
                break;
                case player.falling:
                    if(this.ypos > this.primeY)
                    {
                        this.ypos -= this.cameraSpeed
                    }
                break;
                case !player.jumping && !player.falling:
                    if(this.ypos > this.primeY+cameraSpeed) this.ypos -= cameraSpeed;
                    else this.ypos = this.primeY
            }
        }
    }
}

class cloudsClass{
    constructor({floorSize,canvas,cameraSpeed})
    {
        this.clouds = new Array();
        this.prevX = Math.floor(Math.random()*(canvas.width*(70/100)-canvas.width*(30/100))+canvas.width*(30/100));
        this.xRange = [canvas.width*(50/100),canvas.width*(30/100)];
        this.yRange = [canvas.height*(20/100),canvas.height*(5/100)];
        this.size = [30,20,10];
        
        this.cloudsImage = {
            cs:{img:new cs().array,dim:[192,128]},
            cl:{img:new cl().array,dim:[256,128]},
            cb:{img:new cb().array,dim:[384,256]}
        }


        for(let i = 0; i < Math.round(floorSize*1.5); i++)
        {
            const cloudElement = new cloud(this.prevX,this.yRange,this.size,this.cloudsImage,canvas,cameraSpeed);
            // this.prevX = cloudElement.xpos + cloudElement.width + Math.floor(Math.random()*(this.xRange[0]-this.xRange[1])+this.xRange[1]);
            this.prevX = cloudElement.xpos + Math.floor(Math.random()*(this.xRange[0]-this.xRange[1])+this.xRange[1]);
            this.clouds.push(cloudElement)
        }


        this.render = ({context,speed}) =>{
            const renderable = effRender({parent:this.clouds,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.renderCloud(context);
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let cloud of this.clouds){
                cloud.updateCloudPos(GameObject)
            }
        }
    }
}

class floorHeartsClass{
    constructor()
    {
        this.floorHearts = new Array();
        this.invalidParticle = new Array();
        this.render = ({context,canvas,speed}) =>{
            const renderable = effRender({parent:this.floorHearts,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.renderHeart(context)
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let heart of this.floorHearts)
            {
                heart.updateHeartPos(GameObject)
            }
        }
    }
}

class floorBoostsClass{
    constructor()
    {
        this.floorBoosts = new Array();
        this.invalidParticle = new Array();
        this.render = ({context,canvas,speed}) =>{
            const renderable = effRender({parent:this.floorBoosts,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.renderBoost(context)
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let boost of this.floorBoosts)
            {
                boost.updateBoostPos(GameObject)
            }
        }
    }
}

class floatHeartsClass{
    constructor()
    {
        this.floatHearts = new Array();
        this.invalidParticle = new Array();
        this.render = ({context,canvas,speed}) =>{
            const renderable = effRender({parent:this.floatHearts,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.renderHeart(context)
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let heart of this.floatHearts)
            {
                heart.updateHeartPos(GameObject)
            }
        }
    }
}

class floatBoostsClass{
    constructor()
    {
        this.floatBoosts = new Array();
        this.invalidParticle = new Array();
        this.render = ({context,canvas,speed}) =>{
            const renderable = effRender({parent:this.floatBoosts,speed:speed,canvas:canvas,invalidParticle:this.invalidParticle});
            renderable.forEach(val =>{
                val.renderBoost(context)
            })
            return renderable;
        }

        this.update = (GameObject) =>{
            for(let boost of this.floatBoosts)
            {
                boost.updateBoostPos(GameObject)
            }
        }
    }
}

export const player = (GameObject) =>{
    return new playerClass(GameObject)
}

export const floors = (GameObject) =>{
    return new floorsCreator(GameObject)
}

export const floorCoins = (GameObject) =>{
    return new floorCoinsClass(GameObject)
}

export const floatCoins = (GameObject) =>{
    return new floatCoinsClass(GameObject)
}

export const stakes = (GameObject) =>{
    return new stakesCreator(GameObject)
}

export const floatEnemies = (GameObject)  =>{
    return new floatEnemiesClass(GameObject)
}

export const floorEnemies = (GameObject)  =>{
    return new floorEnemiesClass(GameObject)
}

export const clouds = (GameObject) =>{
    return new cloudsClass(GameObject)
}
export const floatHearts = (GameObject) =>{
    return new floatHeartsClass(GameObject)
}
export const floatBoosts = (GameObject) =>{
    return new floatBoostsClass(GameObject)
}
export const floorHearts = (GameObject) =>{
    return new floorHeartsClass(GameObject)
}
export const floorBoosts = (GameObject) =>{
    return new floorBoostsClass(GameObject)
}