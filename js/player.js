var Player = (function () {
    function Player(scene) {
        this.bullets = [];
        this.grenades = [];
        this.speed = 0.05;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveForward = false;
        this.moveBackward = false;
        this.rotateLeft = false;
        this.rotateRight = false;
        this.parentMesh = BABYLON.MeshBuilder.CreateBox("parentMesh", { width: 1, height: 1, depth: 1 }, scene);
        this.parentMesh.isVisible = false;
        this.parentMesh.name = "player";
        this.sceneRef = scene;
        var faceColors = new Array(6);
        faceColors[0] = new BABYLON.Color4(1, 0, 0, 1);
        faceColors[1] = new BABYLON.Color4(0, 1, 0, 1);
        var options = {
            width: 1,
            height: 2,
            depth: 1,
            faceColors: faceColors
        };
        this.mesh = BABYLON.MeshBuilder.CreateBox('mesh', options, scene);
        this.mesh.parent = this.parentMesh;
        this.mesh.position.y = 1;
        this.mesh.checkCollisions = true;
    }
    Player.prototype.move = function () {
        if (this.moveRight) {
            this.parentMesh.position.x += this.speed;
        }
        if (this.moveLeft) {
            this.parentMesh.position.x -= this.speed;
        }
        if (this.moveForward) {
            this.parentMesh.position.z += this.speed;
        }
        if (this.moveBackward) {
            this.parentMesh.position.z -= this.speed;
        }
        if (this.rotateLeft) {
            this.mesh.rotation.y = -Math.PI / 4;
        }
        else if (this.rotateRight) {
            this.mesh.rotation.y = Math.PI / 4;
        }
        else {
            this.mesh.rotation.y = 0;
        }
        for (var i = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i] || this.bullets[i] == undefined)
                continue;
            this.bullets[i].update();
        }
        for (var j = 0; j < this.grenades.length; j++) {
            if (!this.grenades[j] || this.grenades[j] == undefined)
                continue;
            this.grenades[j].update();
        }
    };
    Player.prototype.shoot = function () {
        var bulletId = this.bullets.length + 1;
        if (this.rotateLeft) {
            this.bullets[bulletId] = new Bullet(this.sceneRef, this, "left");
        }
        else if (this.rotateRight) {
            this.bullets[bulletId] = new Bullet(this.sceneRef, this, "right");
        }
        else {
            this.bullets[bulletId] = new Bullet(this.sceneRef, this, "straight");
        }
        this.bullets[bulletId].id = Utilities.GUID();
    };
    Player.prototype.throwGrenade = function () {
        var grenadeId = this.grenades.length + 1;
        if (this.rotateLeft) {
            this.grenades[grenadeId] = new Grenade(this.sceneRef, this, "left");
        }
        else if (this.rotateRight) {
            this.grenades[grenadeId] = new Grenade(this.sceneRef, this, "right");
        }
        else {
            this.grenades[grenadeId] = new Grenade(this.sceneRef, this, "straight");
        }
        this.grenades[grenadeId].id = Utilities.GUID();
    };
    Player.prototype.disposeBulletWithID = function (id) {
        for (var i = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i] || this.bullets[i] == undefined)
                continue;
            if (this.bullets[i].id == id) {
                var bullet = this.bullets.splice(i, 1);
                bullet[0].mesh.dispose();
                bullet = null;
            }
        }
    };
    Player.prototype.disposeGrenadeWithID = function (id) {
        for (var i = 0; i < this.grenades.length; i++) {
            if (!this.grenades[i] || this.grenades[i] == undefined)
                continue;
            if (this.grenades[i].id == id) {
                var grenade = this.grenades.splice(i, 1);
                grenade[0].mesh.dispose();
                grenade = null;
            }
        }
    };
    return Player;
}());
