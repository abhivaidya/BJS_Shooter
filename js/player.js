var Player = (function () {
    function Player(scene) {
        this.bullets = [];
        this.speed = 0.05;
        this.bulletSpeed = 1;
        this.bulletRange = 100;
        this.bulletDamage = 10;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveForward = false;
        this.moveBackward = false;
        this.rotateLeft = false;
        this.rotateRight = false;
        this.parentMesh = BABYLON.MeshBuilder.CreateBox("parentMesh", { width: 1, height: 1, depth: 1 }, scene);
        this.parentMesh.isVisible = false;
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
            this.bullets[i].position.x += Math.sin(this.bullets[i].rotation.y) * this.bulletSpeed;
            this.bullets[i].position.z += Math.cos(this.bullets[i].rotation.y) * this.bulletSpeed;
            if (this.bullets[i].position.x > this.bulletRange || this.bullets[i].position.x < -this.bulletRange ||
                this.bullets[i].position.z > (this.bulletRange + this.bullets[i].startZPos)) {
                var bullet = this.bullets.splice(i, 1);
                bullet[0].dispose();
            }
            for (var j = 0; j < Game.getInstance().enemies.length; j++) {
                if (this.bullets[i] != undefined && this.bullets[i].intersectsMesh(Game.getInstance().enemies[j].mesh, false)) {
                    var bullet = this.bullets.splice(i, 1);
                    bullet[0].dispose();
                    Game.getInstance().enemies[j].reduceHealth(this.bulletDamage);
                }
            }
        }
    };
    Player.prototype.shoot = function (scene) {
        var bulletId = this.bullets.length + 1;
        this.bullets[bulletId] = BABYLON.Mesh.CreateSphere('bullet', 3, 0.5, scene);
        this.bullets[bulletId].position = this.parentMesh.getAbsolutePosition().clone();
        this.bullets[bulletId].position.y = 1;
        this.bullets[bulletId].rotation = this.mesh.rotation.clone();
        this.bullets[bulletId].startZPos = this.parentMesh.position.z;
        this.bullets[bulletId].material = new BABYLON.StandardMaterial('texture1', scene);
        this.bullets[bulletId].material.diffuseColor = new BABYLON.Color3(3, 2, 0);
    };
    return Player;
}());
