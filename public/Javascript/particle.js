import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js";

class Particle{
    constructor(position, color= "red"){
        const radius = 0.1;
          const widthSegments = 10;
          const heightSegments = 10;
          this.scalingFactor = 30;
          const geometry = new THREE.SphereGeometry(
            radius,
            widthSegments,
            heightSegments,
          );
          const material = new THREE.PointsMaterial({
            color: color,
            size: 0.2,
          });
          this.points = new THREE.Points(geometry, material);
          this.points.position.set(position.x, position.y - 0.3, position.z);
          return this;
    }

    update(dt){
        this.points.scale.set(this.points.scale.x + dt * this.scalingFactor, this.points.scale.y + dt * this.scalingFactor, this.points.scale.z + dt * this.scalingFactor)
        if (this.points.scale.x > 40){
            return true;
        }
        return false;
    }
}

export {Particle};