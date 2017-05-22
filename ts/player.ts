class Player
{
    public mesh;
    public parentMesh;

    private bullets:Array<Bullet> = [];

    private speed = 0.05;
    private bulletSpeed = 1;
    private bulletRange = 100;
    private bulletDamage = 10;

    public moveLeft = false;
    public moveRight = false;
    public moveForward = false;
    public moveBackward = false;

    public rotateLeft = false;
    public rotateRight = false;

    constructor(scene:BABYLON.Scene)
    {
        this.parentMesh = BABYLON.MeshBuilder.CreateBox("parentMesh", {width:1, height:1, depth:1}, scene);
        this.parentMesh.isVisible = false;
        this.parentMesh.name = "player";

        var faceColors = new Array(6);
        faceColors[0] = new BABYLON.Color4(1, 0, 0, 1);
        faceColors[1] = new BABYLON.Color4(0, 1, 0, 1);

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
        this.mesh.checkCollisions = true;
        //this.mesh.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    }

    move()
    {
        if (this.moveRight)
        {
            this.parentMesh.position.x += this.speed;
        }

        if (this.moveLeft)
        {
            this.parentMesh.position.x -= this.speed;
        }

        if (this.moveForward)
        {
            this.parentMesh.position.z += this.speed;
        }

        if (this.moveBackward)
        {
            this.parentMesh.position.z -= this.speed;
        }

        if (this.rotateLeft)
        {
            this.mesh.rotation.y = -Math.PI/4;
        }
        else if (this.rotateRight)
        {
            this.mesh.rotation.y = Math.PI/4;
        }
        else
        {
            this.mesh.rotation.y = 0;
        }

        for (var i = 0; i < this.bullets.length; i++)
        {
            if (!this.bullets[i] || this.bullets[i] == undefined)
                continue;

            this.bullets[i].update();
    	}
    }

    shoot(scene:BABYLON.Scene)
    {
        let bulletId = this.bullets.length + 1;

        if(this.rotateLeft)
        {
		    this.bullets[bulletId] = new Bullet(scene, this, "left");
        }
        else if(this.rotateRight)
        {
            this.bullets[bulletId] = new Bullet(scene, this, "right");
        }
        else
        {
            this.bullets[bulletId] = new Bullet(scene, this, "straight");
        }

        this.bullets[bulletId].id = Utilities.GUID();
    }

    disposeBulletWithID(id:string)
    {
        for (var i = 0; i < this.bullets.length; i++)
        {
            if (!this.bullets[i] || this.bullets[i] == undefined)
                continue;

            if(this.bullets[i].id == id)
            {
                let bullet = this.bullets.splice(i, 1);
                (bullet[0].mesh as BABYLON.Mesh).dispose();
    		}
    	}
    }
}
