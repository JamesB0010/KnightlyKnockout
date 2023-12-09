//reference for getting a hello world of ammo js where a cube falls from the sky https://www.youtube.com/watch?v=puDiCbrjIzc

class RigidBody {
  constructor() {
  };

  CreateBox(mass, pos, quat, size) {
    this.transform = new Ammo.btTransform();
    this.transform.setIdentity();
    this.transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    this.transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    this.motionState = new Ammo.btDefaultMotionState(this.transform);

    const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    this.shape = new Ammo.btBoxShape(btSize);
    this.shape.setMargin(0.05);

    this.inertia = new Ammo.btVector3(0, 0, 0);
    if (mass > 0) {
      this.shape.calculateLocalInertia(mass, this.inertia);
    }

    this.info = new Ammo.btRigidBodyConstructionInfo(
      mass, this.motionState, this.shape, this.inertia);

    this.body = new Ammo.btRigidBody(this.info);

    Ammo.destroy(btSize);
  }

  setRestitution(val) {
    this.body.setRestitution(val);
  }

  setFriction(val) {
    this.body.setFriction(val);
  }

  setRollingFriction(val) {
    this.body.setRollingFriction(val);
  }
}

class PhysicsWorld {
  constructor() {
  }

  Initialise() {
    this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    this.dispacher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
    this.broadphase = new Ammo.btDbvtBroadphase();
    this.solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispacher, this.broadphase, this.solver, this.collisionConfiguration);
    this.physicsWorld.setGravity(new Ammo.btVector3(0, -100, 0));
  }
}

const physicsJsPromise = new Promise((res, rej) => {
  let APP = null;

  let AmmoPromise = Ammo().then(lib => {
    Ammo = lib;
    APP = new PhysicsWorld();
    APP.Initialise();

    return Ammo;
  });

  AmmoPromise.then(_ammo => {
    res([_ammo, APP, RigidBody]);
  })
});

physicsJsPromise.then(info => {
  return info;
})

export { physicsJsPromise };