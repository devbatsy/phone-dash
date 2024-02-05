import { player, floors, floatCoins, floorCoins, floatEnemies, floorEnemies, floatBoosts, floatHearts, floorBoosts, floorHearts, stakes, clouds} from "./function.js";
import { collider } from "./collider.js";
import { updateScore } from "../designjs/functions.js";
export const GlobalGameObject = new Object();


export const loadGame = () =>{

    // GlobalGameObject.timer = setInterval(() =>{
        const collisionParcel = new Object();
        GlobalGameObject.context.clearRect(0,0,canvas.width,canvas.height)

        GlobalGameObject.clouds.render(GlobalGameObject);
        GlobalGameObject.clouds.update(GlobalGameObject);

        // collisionParcel['floatHearts'] = GlobalGameObject.floatHearts.render(GlobalGameObject);
        // GlobalGameObject.floatHearts.update(GlobalGameObject);

        // collisionParcel['floatBoosts'] = GlobalGameObject.floatBoosts.render(GlobalGameObject);
        // GlobalGameObject.floatBoosts.update(GlobalGameObject);

        // collisionParcel['floorHearts'] = GlobalGameObject.floorHearts.render(GlobalGameObject);
        // GlobalGameObject.floorHearts.update(GlobalGameObject);

        // collisionParcel['floorBoosts'] = GlobalGameObject.floorBoosts.render(GlobalGameObject);
        // GlobalGameObject.floorBoosts.update(GlobalGameObject);


        collisionParcel['floatCoins'] = GlobalGameObject.floatCoins.render(GlobalGameObject);
        GlobalGameObject.floatCoins.update(GlobalGameObject);


        collisionParcel['floorCoins'] = GlobalGameObject.floorCoins.render(GlobalGameObject);
        GlobalGameObject.floorCoins.update(GlobalGameObject);


        GlobalGameObject.player.render(GlobalGameObject.context);
        GlobalGameObject.player.updateGamePlayer();


        collisionParcel['floors'] = GlobalGameObject.floors.render(GlobalGameObject)
        GlobalGameObject.floors.update(GlobalGameObject)


        collisionParcel['floatStakes'] = GlobalGameObject.floatStakes.render(GlobalGameObject)
        GlobalGameObject.floatStakes.update(GlobalGameObject)

        collisionParcel['floatEnemies'] = GlobalGameObject.floatEnemies.render(GlobalGameObject);
        GlobalGameObject.floatEnemies.update(GlobalGameObject);

        collisionParcel['floorEnemies'] = GlobalGameObject.floorEnemies.render(GlobalGameObject);
        GlobalGameObject.floorEnemies.update(GlobalGameObject);

        collider(collisionParcel,GlobalGameObject);
        // console.log(GlobalGameObject)
    // },20);
}

export const createGameObject = () =>{
    const setCanvasSize = (x,y) =>{
        x = Number(x.slice(0,x.length-2));
        y = Number(y.slice(0,y.length-2));
        canvas.height = y;
        canvas.width = x;
    }
    
    setCanvasSize(getComputedStyle(document.body).width,getComputedStyle(document.body).height)
    
    addEventListener('resize', e =>{
        setCanvasSize(getComputedStyle(document.body).width,getComputedStyle(document.body).height)
    })

    GlobalGameObject.rate = GlobalGameObject.rate  > 0.55 ? 0.55 : (canvas.height/canvas.width);
    GlobalGameObject.rate = GlobalGameObject.rate  < 0.5 ? 0.5 : GlobalGameObject.rate;
    GlobalGameObject.canvas = canvas;
    GlobalGameObject.floorSize = 500;
    GlobalGameObject.speed = 10*GlobalGameObject.rate;
    GlobalGameObject.speedPrime = GlobalGameObject.speed
    GlobalGameObject.cameraSpeed = 3;
    GlobalGameObject.base = GlobalGameObject.canvas.height - GlobalGameObject.canvas.height*(10/100);
    GlobalGameObject.context = canvas.getContext('2d');
    GlobalGameObject.clouds = clouds(GlobalGameObject);
    // GlobalGameObject.floatHearts = floatHearts();
    // GlobalGameObject.floorHearts= floorHearts();
    // GlobalGameObject.floatBoosts = floatBoosts();
    // GlobalGameObject.floorBoosts = floorBoosts();
    GlobalGameObject.floorCoins = floorCoins(GlobalGameObject);
    GlobalGameObject.floatCoins = floatCoins(GlobalGameObject);
    GlobalGameObject.floatEnemies = floatEnemies(GlobalGameObject);
    GlobalGameObject.floorEnemies = floorEnemies(GlobalGameObject);
    GlobalGameObject.player = player(GlobalGameObject);
    GlobalGameObject.floors = floors(GlobalGameObject);
    GlobalGameObject.floatStakes = stakes(GlobalGameObject);
    GlobalGameObject.animating = false;
    GlobalGameObject.counter = 0;
    GlobalGameObject.score = 0;
    GlobalGameObject.collectCoins = 0;
    GlobalGameObject.wallCollision = false;
    GlobalGameObject.rate = (canvas.height/canvas.width);
    loadGame()
}

export const initCanvas = () =>{
    canvas.addEventListener('click', e =>{
        switch(true)
        {
            case !GlobalGameObject.player.jumping && !GlobalGameObject.player.falling:
                GlobalGameObject.player.jumping = true;
        }
    })

    canvas.addEventListener('touchstart', e =>{
        switch(true)
        {
            case !GlobalGameObject.player.jumping && !GlobalGameObject.player.falling:
                GlobalGameObject.player.jumping = true;
        }
    })
}

export const animate = () =>{
    GlobalGameObject.timer = requestAnimationFrame(animate);
    loadGame();
    if(GlobalGameObject.counter > 10)
    {
        GlobalGameObject.counter = 0;
        GlobalGameObject.score++;
        if(GlobalGameObject.speed < 16)
        {
            GlobalGameObject.speed += (0.04*GlobalGameObject.rate);
            // console.log(GlobalGameObject.speed)
        }
        if(GlobalGameObject.player.jumpSpeed < 16)
        {
            GlobalGameObject.player.jumpSpeed += 0.04*GlobalGameObject.rate;
            // console.log(GlobalGameObject.player.jumpSpeed)
        }
        if(GlobalGameObject.player.fallSpeed < 16)
        {
            GlobalGameObject.player.fallSpeed += 0.04*GlobalGameObject.rate
            // console.log(GlobalGameObject.player.fallSpeed)
        }
        updateScore()
    }else{
        GlobalGameObject.counter++;
    }
}