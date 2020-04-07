// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 这个属性引用了星星动画的预制资源
        animRootPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        //按钮节点，用于开始游戏
        btnNode: {
            default: null,
            type: cc.Node
        },
        //游戏结束文本节点
        gameOverNode: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        this.currentStart = null;
        this.currentAnimRoot = null;

        // 生成一个新的星星
        // this.spawnNewStar();

        //控制是否展示菜单或者开始游戏
        this.enabled = false;

        // 初始化计分
        this.score = 0;

        //初始化星星对象池
        this.starPool = new cc.NodePool('Star');
        this.scorePool = new cc.NodePool('ScoreAnim');
    },

    spawnNewStar: function () {
        var newStar = null;
        // 使用给定的模板在场景中生成一个新节点
        if(this.starPool.size() > 0) {
            newStar = this.starPool.get(this);
        }
        else {
            newStar = cc.instantiate(this.starPrefab);
            newStar.getComponent('Star').reuse(this);
        }
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('Star').game = this;
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;

        this.currentStart = newStar;
    },

    despawnStar (star) {
        this.starPool.put(star);
        this.spawnNewStar();
    },

    spawnAnimRoot: function () {
        var fx;
        if(this.scorePool.size() > 0) {
            fx = this.scorePool.get(this);
        }
        else {
            fx = cc.instantiate(this.animRootPrefab);
            fx.getComponent('ScoreAnim').reuse(this);
        }
        return fx;
    },

    despawnAnimRoot() {
        this.scorePool.put(this.currentAnimRoot);
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    gainScore: function (pos) {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放特效
        this.currentAnimRoot = this.spawnAnimRoot();
        this.node.addChild(this.currentAnimRoot);
        this.currentAnimRoot.setPosition(pos);
        this.currentAnimRoot.getComponent(cc.Animation).play('score_pop');
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver: function () {
        this.gameOverNode.active = true;//展示游戏结束文本
        this.btnNode.x = 0;//展示开始按钮
        this.player.getComponent('Player').enabled = false;
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        // cc.director.loadScene('game');
        this.currentStart.destroy();//销毁场景中的星星
    },

    onStartGame: function () {
        //初始化得分
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        //打开游戏开关
        this.enabled = true;
        //关闭游戏结束文本文本
        this.gameOverNode.active = false;
        //将按钮与游戏结束文本一起移出场景
        this.btnNode.x = 3000;
        //重新设置palyer的位置与移动速度
        this.player.getComponent('Player').startMoveAt(cc.v2(0, this.groundY));
        //生成星星
        this.spawnNewStar();
    },

    start() {

    },

    update: function (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false;
            return;
        }
        this.timer += dt;
    },
});
