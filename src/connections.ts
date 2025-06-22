import * as THREE from 'three';
import { Connection } from './types';

export class ConnectionRenderer {
  private scene: THREE.Scene;
  private connections: THREE.Group[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public createConnections(connections: Connection[], componentPositions: Map<string, THREE.Vector3>) {
    connections.forEach(connection => {
      const fromPos = componentPositions.get(connection.from);
      const toPos = componentPositions.get(connection.to);
      
      if (fromPos && toPos) {
        const connectionGroup = this.createConnection(fromPos, toPos, connection.type);
        this.connections.push(connectionGroup);
        this.scene.add(connectionGroup);
      }
    });
  }

  private createConnection(from: THREE.Vector3, to: THREE.Vector3, type: string): THREE.Group {
    const group = new THREE.Group();
    
    // Create curved path
    const curve = new THREE.QuadraticBezierCurve3(
      from,
      new THREE.Vector3(
        (from.x + to.x) / 2,
        Math.max(from.y, to.y) + 2,
        (from.z + to.z) / 2
      ),
      to
    );
    
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Different colors for different connection types
    let color: number;
    let opacity: number;
    switch (type) {
      case 'secure':
        color = 0xff4444; // Red for secure connections
        opacity = 0.8;
        break;
      case 'data':
        color = 0x44ff44; // Green for data connections
        opacity = 0.6;
        break;
      case 'api':
        color = 0x4444ff; // Blue for API connections
        opacity = 0.7;
        break;
      default:
        color = 0xffffff;
        opacity = 0.5;
    }
    
    const material = new THREE.LineBasicMaterial({ 
      color,
      transparent: true,
      opacity
    });
    
    const line = new THREE.Line(geometry, material);
    group.add(line);
    
    // Add animated particles along the connection
    this.addConnectionParticles(group, curve, color);
    
    return group;
  }

  private addConnectionParticles(group: THREE.Group, curve: THREE.QuadraticBezierCurve3, color: number) {
    const particleCount = 3;
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.05, 8, 8);
      const material = new THREE.MeshBasicMaterial({ 
        color,
        transparent: true,
        opacity: 0.8
      });
      const particle = new THREE.Mesh(geometry, material);
      
      particle.userData = {
        curve,
        progress: i / particleCount,
        speed: 0.01 + Math.random() * 0.02
      };
      
      group.add(particle);
    }
  }

  public animateConnections() {
    this.connections.forEach(connectionGroup => {
      connectionGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.userData.curve) {
          const data = child.userData;
          data.progress += data.speed;
          
          if (data.progress > 1) {
            data.progress = 0;
          }
          
          const position = data.curve.getPoint(data.progress);
          child.position.copy(position);
        }
      });
    });
  }
}
