import { togPauseButton, reducePlayerLife, increasePlayerLife, updateMaxScore, updateCoin} from '../designjs/functions.js'

class collisionDetector{
    constructor(particles,GameObject)
    {
        this.collisionResult = new Object();
        const {player} = GameObject;

        let collideWithFloor = true;
        for(let [prop,value] of Object.entries(particles))
        {
            const result = this.collisionResult[prop] = new Object();
            let index = 0
            for(let {xpos,width,ypos,height} of value)
            {
                let particleX = xpos;
                let particleWidth = width;
                let partilceY = ypos;
                let particleHeight = height;
                switch(true)
                {
                    case prop === 'floorCoins' || prop === 'floatCoins':
                        particleX -= (particleWidth/2)
                }
                if(
                    player.xpos < (particleX + particleWidth) &&
                    (player.xpos + player.width) > particleX &&
                    player.ypos < (partilceY + particleHeight) &&
                    player.ypos + player.height > partilceY
                ){
                    switch(true)
                    { 
                        case prop === 'floorCoins' || prop === 'floatCoins' || prop === 'floatEnemies' || prop === 'floorEnemies' || prop === 'floatHearts' || prop === 'floatBoosts' || prop === 'floorHearts' || prop === 'floorBoosts':
                            let removeParticle = true
                            switch(true)
                            {
                                case prop === 'floatEnemies' || prop === 'floorEnemies':
                                    if(!player.invulnerable)
                                    {
                                        reducePlayerLife();
                                    }else{
                                        removeParticle = false
                                    }
                                break;
                                case prop === 'floatHearts' || prop === 'floorHearts':
                                    increasePlayerLife();
                                break;
                                case prop === 'floatBoosts' || prop === 'floorBoosts':
                                    GameObject.player.invulnerable = true;
                                    GameObject.player.vulnerabilityCount = 0;
                                break;
                                case prop === 'floatCoins' || prop === "floorCoins":
                                    GameObject.collectCoins += 1;
                                    updateCoin();
                                    new playSound('coinsplash.ogg')
                            }

                            const particleIndex = GameObject[prop][prop].indexOf(value[0]);
                            switch(true)
                            {
                                case !GameObject[prop].invalidParticle.includes(particleIndex) && removeParticle:
                                    GameObject[prop].invalidParticle.push(particleIndex)
                            }

                        break;
                        case prop === 'floatStakes':

                            //ON STAKE COLLISION TYPE
                            collideWithFloor = false;

                            if((player.xpos+player.width-particleX) < player.ypos+player.height-partilceY && (player.xpos+player.width-particleX) < partilceY+particleHeight-player.ypos)
                            {
                                // RIGHT SIDE COLLISION WITH THE STAKE
                                // updateMaxScore();
                                // togPlaySec();
                                // togPauseButton();
                                GameObject.player.bottomCollision(partilceY+particleHeight)

                            }else{
                                if(player.ypos-(partilceY+particleHeight) > partilceY-(player.ypos+player.height))
                                {
                                    //BOTTOM COLLSION WITH THE STAKE
                                    GameObject.player.bottomCollision(partilceY+particleHeight)
                                }else{
                                    //TOP COLLISION WITH THE STAKE
                                    GameObject.player.onStakeCollision(partilceY)
                                }
                            }
                    }
                }
                index++;
            }
        }

        // switch(true)
        // {
        //     case !GameObject.wallCollision:
        //         GameObject.speed = GameObject.speedPrime;
        //     break;
        //     default:
        //         switch(true)
        //         {
        //             case GameObject.speed > 10:
        //                 GameObject.speedPrime = GameObject.speed
        //         }
        //         GameObject.speed = 4;
        // }

        switch(true)
        {
            case collideWithFloor && !player.atGround:
                GameObject.player.noCollision()
        }
    }
}

export const collider = (particles,GameObject) =>{
    new collisionDetector(particles,GameObject)
}