var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Naruto, Naruto_running, Naruto_collided;
var ground, invisibleGround, groundImage;

var narutomakisGroup, narutomakiImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  Naruto_running = loadAnimation("assets/n1.png","assets/n2.png","assets/n3.png","assets/n4.png");
  Naruto_collided = loadAnimation("assets/naruto_collided.PNG");
  backgroundImg = loadImage("assets/naruto_bg_day.jpg");
  
  //groundImage = loadImage("ground2.png");
  
  narutomakiImage = loadImage("assets/points.png");
  
  obstacle1 = loadImage("assets/kunai.png");
  obstacle2 = loadImage("assets/shuriken1.png");
  obstacle3 = loadImage("assets/shuriken2.png");
  
  restartImg = loadImage("assets/restart_button.png")
  gameOverImg = loadImage("assets/game_over.png")

  bgDay = loadImage("assets/naruto_bg_day.jpg")
  bgEvening = loadImage("assets/naruto_bg_evening.jpg")
  bgNight = loadImage("assets/naruto_bg_night.jpg")
  
  jumpSound = loadSound("assets/jump_sound.wav")
  dieSound = loadSound("assets/stab_sound.mp3")
  pointSound = loadSound("assets/point_beep.mp3")
  gameOverSound = loadSound("assets/game_over.mp3")
  //checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth, displayHeight-150);

  Naruto = createSprite(100,height-120,20,50);
  
  Naruto.addAnimation("running", Naruto_running);
  Naruto.addAnimation("collided", Naruto_collided);
  
  Naruto.scale = 0.5;
  
  ground = createSprite(width/2,height/2,width,20);
  ground.addImage("ground1",backgroundImg);
  //ground.addImage("ground2",bgEvening);
  //ground.addImage("ground3",bgNight);
  ground.depth=0
  ground.x = ground.width /2;

  invisibleGround = createSprite(200,height-60,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(width/2,height/2-150);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+50);
  restart.addImage(restartImg);
  //restart.debug=true
  gameOver.scale = 0.3;
  restart.scale = 0.3;

  //create Obstacle and narutomaki Groups
  obstaclesGroup = createGroup();
  narutomakisGroup = createGroup();

  Naruto.setCollider("rectangle",0,0,100,220);
  //Naruto.debug = true
  
  score = 0;
}

function draw() {
  
  background(bgDay);
  
  //displaying score
  
  
  if(gameState === PLAY){
    //move the 
    gameOver.visible = false;
    restart.visible = false;
    //change the Naruto animation
      Naruto.changeAnimation("running", Naruto_running);
    
    ground.velocityX = -(4 + 3* score/10)
    //scoring
    //score = score + Math.round(getFrameRate()/60);
    if (Naruto.isTouching(narutomakisGroup)){
      score=score+1
      narutomakisGroup.destroyEach()
      console.log(score);
    }
  
    if(score>0 && score%100 === 0){
     //  checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& Naruto.y >= height-190) {
        Naruto.velocityY = -20;
        jumpSound.play();
    }
    
    //add gravity
    Naruto.velocityY = Naruto.velocityY + 0.8
  
    //spawn the narutomakis
    spawnnarutomakis();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(Naruto)){
        //Naruto.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
    }
  }

   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //change the Naruto animation
      Naruto.changeAnimation("collided", Naruto_collided);
      Naruto.scale=1.5
      ground.velocityX = 0;
      Naruto.velocityY = 0
      
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    narutomakisGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     narutomakisGroup.setVelocityXEach(0);   
     
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
  //stop Naruto from falling down
  Naruto.collide(invisibleGround);
  
  drawSprites();
  textSize(30)
  fill("blue")
  stroke(3)
  text("Score: "+ score, 500,50);
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  Naruto.scale=0.5
  obstaclesGroup.destroyEach();
  narutomakisGroup.destroyEach();
  
  Naruto.changeAnimation("running",Naruto_running);
  
  //if(localStorage["HighestScore"]<score){
   // localStorage["HighestScore"] = score;
  //}
  //console.log(localStorage["HighestScore"]);
  score = 0;
}

function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(width,height-130,10,40);
   obstacle.velocityX = -(6 + score/50);
   obstacle.y= random(height-200,height-100)
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
     
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 600;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnnarutomakis() {
  //write code here to spawn the narutomakis
 if (frameCount % 160 === 0) {
    var narutomaki = createSprite(width,height-200,40,10);
    narutomaki.y = Math.round(random(height-350,height-150));
    narutomaki.addImage(narutomakiImage);
    narutomaki.scale = 0.5;
    narutomaki.velocityX = -10-score/50;
  
     //assign lifetime to the variable
    narutomaki.lifetime = 600;
    
    //adjust the depth
    narutomaki.depth = Naruto.depth;
    Naruto.depth = Naruto.depth + 1;
    
    //add each narutomaki to the group
    narutomakisGroup.add(narutomaki);
  }
}
async function getBackgroundImg(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  
  if(hour>=0600 && hour<=1400){
      bg = "assets/naruto_bg_day.jpg";
  }
  else if (hour>1400&& hour<=1900){
    bg="assets/naruto_bg_evening.jpg";
  }
  else{
      bg = "assets/naruto_bg_day.jpg";
  }
  
  backgroundImg = loadImage(bg);
  console.log(backgroundImg);
}

