window.__require=function t(e,i,n){function o(s,a){if(!i[s]){if(!e[s]){var r=s.split("/");if(r=r[r.length-1],!e[r]){var h="function"==typeof __require&&__require;if(!a&&h)return h(r,!0);if(c)return c(r,!0);throw new Error("Cannot find module '"+s+"'")}s=r}var u=i[s]={exports:{}};e[s][0].call(u.exports,function(t){return o(e[s][1][t]||t)},u,u.exports,t,e,i,n)}return i[s].exports}for(var c="function"==typeof __require&&__require,s=0;s<n.length;s++)o(n[s]);return o}({Game:[function(t,e,i){"use strict";cc._RF.push(e,"3d2e0/6TWZPjKsynWCySWuf","Game"),cc.Class({extends:cc.Component,properties:{starPrefab:{default:null,type:cc.Prefab},animRootPrefab:{default:null,type:cc.Prefab},maxStarDuration:0,minStarDuration:0,ground:{default:null,type:cc.Node},player:{default:null,type:cc.Node},scoreDisplay:{default:null,type:cc.Label},scoreAudio:{default:null,type:cc.AudioClip},btnNode:{default:null,type:cc.Node},gameOverNode:{default:null,type:cc.Node}},onLoad:function(){this.groundY=this.ground.y+this.ground.height/2,this.timer=0,this.starDuration=0,this.currentStart=null,this.currentAnimRoot=null,this.enabled=!1,this.score=0,this.starPool=new cc.NodePool("Star"),this.scorePool=new cc.NodePool("ScoreAnim")},spawnNewStar:function(){var t=null;this.starPool.size()>0?t=this.starPool.get(this):(t=cc.instantiate(this.starPrefab)).getComponent("Star").reuse(this),t.setPosition(this.getNewStarPosition()),this.node.addChild(t),t.getComponent("Star").game=this,this.starDuration=this.minStarDuration+Math.random()*(this.maxStarDuration-this.minStarDuration),this.timer=0,this.currentStart=t},despawnStar:function(t){this.starPool.put(t),this.spawnNewStar()},spawnAnimRoot:function(){var t;return this.scorePool.size()>0?t=this.scorePool.get(this):(t=cc.instantiate(this.animRootPrefab)).getComponent("ScoreAnim").reuse(this),t},despawnAnimRoot:function(){this.scorePool.put(this.currentAnimRoot)},getNewStarPosition:function(){var t,e=this.groundY+Math.random()*this.player.getComponent("Player").jumpHeight+50,i=this.node.width/2;return t=2*(Math.random()-.5)*i,cc.v2(t,e)},gainScore:function(t){this.score+=1,this.scoreDisplay.string="Score: "+this.score.toString(),this.currentAnimRoot=this.spawnAnimRoot(),this.node.addChild(this.currentAnimRoot),this.currentAnimRoot.setPosition(t),this.currentAnimRoot.getComponent(cc.Animation).play("score_pop"),cc.audioEngine.playEffect(this.scoreAudio,!1)},gameOver:function(){this.gameOverNode.active=!0,this.btnNode.x=0,this.player.getComponent("Player").enabled=!1,this.player.stopAllActions(),this.currentStart.destroy()},onStartGame:function(){this.score=0,this.scoreDisplay.string="Score: "+this.score.toString(),this.enabled=!0,this.gameOverNode.active=!1,this.btnNode.x=3e3,this.player.getComponent("Player").startMoveAt(cc.v2(0,this.groundY)),this.spawnNewStar()},start:function(){},update:function(t){if(this.timer>this.starDuration)return this.gameOver(),void(this.enabled=!1);this.timer+=t}}),cc._RF.pop()},{}],Player:[function(t,e,i){"use strict";cc._RF.push(e,"0ee25esn0VL7J8RAdfUyUDg","Player"),cc.Class({extends:cc.Component,properties:{jumpHeight:0,jumpDuration:0,maxMoveSpeed:0,accel:0,squashDuration:0,jumpAudio:{default:null,type:cc.AudioClip}},start:function(){},onLoad:function(){this.enabled=!1,this.jumpAction=this.setJumpAction(),this.accLeft=!1,this.accRight=!1,this.xSpeed=0,cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);var t=cc.Canvas.instance.node;t.on("touchstart",this.onTouchStart,this),t.on("touchend",this.onTouchEnd,this)},onDestroy:function(){cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this),cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);var t=cc.Canvas.instance.node;t.off("touchstart",this.onTouchStart,this),t.off("touchend",this.onTouchEnd,this)},setJumpAction:function(){var t=cc.moveBy(this.jumpDuration,cc.v2(0,this.jumpHeight)).easing(cc.easeCubicActionOut()),e=cc.moveBy(this.jumpDuration,cc.v2(0,-this.jumpHeight)).easing(cc.easeCubicActionIn()),i=cc.scaleTo(this.squashDuration,1,.6),n=cc.scaleTo(this.squashDuration,1,1.2),o=cc.scaleTo(this.squashDuration,1,1),c=cc.callFunc(this.playJumpSound,this);return cc.repeatForever(cc.sequence(i,n,t,o,e,c))},playJumpSound:function(){cc.audioEngine.playEffect(this.jumpAudio,!1)},onKeyDown:function(t){switch(t.keyCode){case cc.macro.KEY.a:case cc.macro.KEY.left:this.accLeft=!0;break;case cc.macro.KEY.d:case cc.macro.KEY.right:this.accRight=!0}},onKeyUp:function(t){switch(t.keyCode){case cc.macro.KEY.a:case cc.macro.KEY.left:this.accLeft=!1;break;case cc.macro.KEY.d:case cc.macro.KEY.right:this.accRight=!1}},onTouchStart:function(t){t.getLocation().x>=cc.winSize.width/2?(this.accLeft=!1,this.accRight=!0):(this.accLeft=!0,this.accRight=!1)},onTouchEnd:function(t){this.accLeft=!1,this.accRight=!1},startMoveAt:function(t){this.enabled=!0,this.xSpeed=0,this.node.setPosition(t),this.node.runAction(this.setJumpAction())},update:function(t){this.accLeft?this.xSpeed-=this.accel*t:this.accRight&&(this.xSpeed+=this.accel*t),Math.abs(this.xSpeed)>this.maxMoveSpeed&&(this.xSpeed=this.maxMoveSpeed*this.xSpeed/Math.abs(this.xSpeed)),this.node.x+=this.xSpeed*t,this.node.x>this.node.parent.width/2?(this.node.x=this.node.parent.width/2,this.xSpeed=0):this.node.x<-this.node.parent.width/2&&(this.node.x=-this.node.parent.width/2,this.xSpeed=0)}}),cc._RF.pop()},{}],ScoreAnim:[function(t,e,i){"use strict";cc._RF.push(e,"df485XRgnhC2atCA393uZOY","ScoreAnim"),cc.Class({extends:cc.Component,properties:{},reuse:function(t){this.game=t},despawn:function(){this.game.despawnAnimRoot()},start:function(){}}),cc._RF.pop()},{}],Star:[function(t,e,i){"use strict";cc._RF.push(e,"011ffdnAPhLFbzCqXcG7KXz","Star"),cc.Class({extends:cc.Component,properties:{pickRadius:0},getPlayerDistance:function(){var t=this.game.player.getPosition();return this.node.position.sub(t).mag()},onPicked:function(){var t=this.node.getPosition();this.game.gainScore(t),this.game.despawnStar(this.node)},reuse:function(t){this.game=t,this.enabled=!0,this.node.opacity=255},unuse:function(){},start:function(){},update:function(t){if(this.getPlayerDistance()<this.pickRadius)this.onPicked();else{var e=1-this.game.timer/this.game.starDuration;this.node.opacity=50+Math.floor(205*e)}}}),cc._RF.pop()},{}],"use_v2.0.x_cc.Toggle_event":[function(t,e,i){"use strict";cc._RF.push(e,"d1dcfZfiP1F/Y+6YUHWWB5f","use_v2.0.x_cc.Toggle_event"),cc.Toggle&&(cc.Toggle._triggerEventInScript_check=!0),cc._RF.pop()},{}]},{},["use_v2.0.x_cc.Toggle_event","Game","Player","ScoreAnim","Star"]);