class Enemy
{
    public mesh;
    public parentMesh;

    private bullets = [];

    private speed = 0.05;
    private bulletSpeed = 2;
    private bulletRange = 100;

    private maxHealth = 20;

    private sceneRef:BABYLON.Scene;

    public canShoot = false;
    private shootIntervalSet = false;

    private shootingInterval = 0;

    constructor(scene:BABYLON.Scene)
    {
        this.sceneRef = scene;

        this.parentMesh = BABYLON.MeshBuilder.CreateBox("parentMesh", {width:1, height:1, depth:1}, scene);
        this.parentMesh.isVisible = false;

        var faceColors = new Array(6);
        faceColors[0] = new BABYLON.Color4(1, 0, 0, 1);
        faceColors[1] = new BABYLON.Color4(1, 0, 0, 1);
        faceColors[2] = new BABYLON.Color4(1, 0, 0, 1);
        faceColors[3] = new BABYLON.Color4(1, 0, 0, 1);
        faceColors[4] = new BABYLON.Color4(1, 0, 0, 1);
        faceColors[5] = new BABYLON.Color4(1, 0, 0, 1);

        var options = {
            width: 1,
            height: 2,
            depth: 1,
            //faceUV: faceUV,
            faceColors : faceColors
        };

        this.mesh = BABYLON.MeshBuilder.CreateBox('mesh', options, scene);
        this.mesh.parent = this.parentMesh;
        this.mesh.position.y = 1;
    }

    move()
    {
        for (var i = 0, max = this.bullets.length; i < max; i += 1)
        {
    		if (!this.bullets[i] || this.bullets[i] == undefined)
                continue;

    		this.bullets[i].position.x += Math.sin(this.bullets[i].rotation.y) * this.bulletSpeed;
    		this.bullets[i].position.z += Math.cos(this.bullets[i].rotation.y) * this.bulletSpeed;

            if(this.bullets[i].position.x > this.bulletRange || this.bullets[i].position.x < -this.bulletRange ||
                this.bullets[i].position.z > (this.bulletRange + this.bullets[i].startZPos))
            {
                let bullet = this.bullets.splice(i, 1);
                (bullet[0] as BABYLON.Mesh).dispose();
            }
    	}

        if(this.canShoot)
        {
            if(!this.shootIntervalSet)
            {
                console.log("setting interval");
                this.shootingInterval = setInterval(this.shoot.bind(this), 2000);
                this.shootIntervalSet = true;
            }
        }
        else
        {
            if(this.shootIntervalSet)
            {
                console.log("clearing interval");
                clearInterval(this.shootingInterval);
                this.shootIntervalSet = false;
            }
        }
    }

    shoot()
    {
        console.log("shooting");

        let bulletId = this.bullets.length + 1;

		this.bullets[bulletId] = BABYLON.Mesh.CreateSphere('bullet', 3, 0.5, this.sceneRef);
		this.bullets[bulletId].position = this.parentMesh.getAbsolutePosition().clone();
		this.bullets[bulletId].position.y = 1;
		this.bullets[bulletId].rotation = this.mesh.rotation.clone();
		this.bullets[bulletId].startZPos = this.parentMesh.position.z;

		this.bullets[bulletId].material = new BABYLON.StandardMaterial('texture1', this.sceneRef);
		this.bullets[bulletId].material.diffuseColor = new BABYLON.Color3(3, 0, 0);
    }

    reduceHealth (damage:number)
    {
        this.maxHealth -= damage;

        if(this.maxHealth <= 0)
        {
            Game.getInstance().disposeEnemy(this.parentMesh.id);

            if(this.shootIntervalSet)
            {
                clearInterval(this.shootingInterval);
                this.shootIntervalSet = false;
            }
        }
    }
}
