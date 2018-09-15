__require=function e(t,i,n){function c(a,s){if(!i[a]){if(!t[a]){var r=a.split("/");if(r=r[r.length-1],!t[r]){var l="function"==typeof __require&&__require;if(!s&&l)return l(r,!0);if(o)return o(r,!0);throw new Error("Cannot find module '"+a+"'")}}var u=i[a]={exports:{}};t[a][0].call(u.exports,function(e){return c(t[a][1][e]||e)},u,u.exports,e,t,i,n)}return i[a].exports}for(var o="function"==typeof __require&&__require,a=0;a<n.length;a++)c(n[a]);return c}({Ball:[function(e,t,i){"use strict";cc._RF.push(t,"9b280YbFuZJv4QPGPL8e8iv","Ball"),cc.Class({extends:cc.Component,properties:{},init:function(e){this.gameCtl=e,this.node.position=cc.v2(360,270),this.getComponent(cc.RigidBody).linearVelocity=cc.v2(800,800)},onBeginContact:function(e,t,i){switch(i.tag){case 1:this.gameCtl.onBallContactBrick(t.node,i.node);break;case 2:this.gameCtl.onBallContactGround(t.node,i.node);break;case 3:this.gameCtl.onBallContactPaddle(t.node,i.node);break;case 4:this.gameCtl.onBallContactWall(t.node,i.node)}}}),cc._RF.pop()},{}],BrickLayout:[function(e,t,i){"use strict";cc._RF.push(t,"62398FSMJtHJ55jmSoqf4WF","BrickLayout"),cc.Class({extends:cc.Component,properties:{padding:0,spacing:0,cols:0,brickPrefab:cc.Prefab,bricksNumber:0},init:function(e){this.node.removeAllChildren(),this.bricksNumber=e;for(var t=0;t<this.bricksNumber;t++){var i=cc.instantiate(this.brickPrefab);i.parent=this.node,i.x=this.padding+t%this.cols*(i.width+this.spacing)+i.width/2,i.y=-this.padding-Math.floor(t/this.cols)*(i.height+this.spacing)-i.height/2}}}),cc._RF.pop()},{}],GameCtl:[function(e,t,i){"use strict";cc._RF.push(t,"a337308uxxJva7vh8G06q7Z","GameCtl");var n=e("GameModel");cc.Class({extends:cc.Component,properties:{gameView:e("GameView"),ball:e("Ball"),paddle:e("Paddle"),brickLayout:e("BrickLayout"),overPanel:e("OverPanel")},onLoad:function(){cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,function(e){e.keyCode===cc.KEY.back&&cc.director.end()}),this.physicsManager=cc.director.getPhysicsManager(),this.gameModel=new n,this.startGame()},init:function(){this.physicsManager.enabled=!0,this.gameModel.init(),this.gameView.init(this),this.ball.init(this),this.paddle.init(),this.brickLayout.init(this.gameModel.bricksNumber),this.overPanel.init(this)},startGame:function(){this.init()},pauseGame:function(){this.physicsManager.enabled=!1},resumeGame:function(){this.physicsManager.enabled=!0},stopGame:function(){this.physicsManager.enabled=!1,this.overPanel.show(this.gameModel.score,0===this.gameModel.bricksNumber)},onBallContactBrick:function(e,t){t.parent=null,this.gameModel.addScore(1),this.gameModel.minusBrick(1),this.gameView.updateScore(this.gameModel.score),this.gameModel.bricksNumber<=0&&this.stopGame()},onBallContactGround:function(e,t){this.stopGame()},onBallContactPaddle:function(e,t){},onBallContactWall:function(e,t){},onDestroy:function(){this.physicsManager.enabled=!1}}),cc._RF.pop()},{Ball:"Ball",BrickLayout:"BrickLayout",GameModel:"GameModel",GameView:"GameView",OverPanel:"OverPanel",Paddle:"Paddle"}],GameModel:[function(e,t,i){"use strict";cc._RF.push(t,"ac11fh/SXFFzZAzJ57bmcvY","GameModel"),cc.Class({extends:cc.Component,properties:{score:0,bricksNumber:0},init:function(){this.score=0,this.bricksNumber=50},addScore:function(e){this.score+=e},minusBrick:function(e){this.bricksNumber-=e}}),cc._RF.pop()},{}],GameView:[function(e,t,i){"use strict";cc._RF.push(t,"e4735UW3lFPMoW0rK22obsG","GameView"),cc.Class({extends:cc.Component,properties:{scoreLabel:cc.Label},init:function(e){this.gameCtl=e,this.scoreLabel.string="0"},updateScore:function(e){this.scoreLabel.string=e}}),cc._RF.pop()},{}],OverPanel:[function(e,t,i){"use strict";cc._RF.push(t,"60425zRIQ5LNIZ6KmZ5p/LN","OverPanel"),cc.Class({extends:cc.Component,properties:{resultLabel:cc.Label,scoreLabel:cc.Label},onLoad:function(){},init:function(e){this.gameCtl=e,this.node.active=!1},show:function(e,t){this.node.active=!0,this.resultLabel.string=t?"YOU WIN!":"YOU LOSE!",this.scoreLabel.string=e+""},onBtnRestart:function(){this.gameCtl.startGame()}}),cc._RF.pop()},{}],Paddle:[function(e,t,i){"use strict";cc._RF.push(t,"4dc82c1qO9KbZBsMZGbHlMV","Paddle"),cc.Class({extends:cc.Component,onLoad:function(){var e=this;this.node.parent.on("touchmove",function(t){var i=e.node.parent.convertToNodeSpace(t.getLocation());e.node.x=i.x})},init:function(){this.node.x=360}}),cc._RF.pop()},{}]},{},["GameCtl","GameModel","Ball","BrickLayout","GameView","OverPanel","Paddle"]);