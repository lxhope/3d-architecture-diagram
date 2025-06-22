import * as THREE from 'three';
import { SceneSetup } from './scene';
import { ComponentRenderer } from './components';
import { ConnectionRenderer } from './connections';
import { CameraControls } from './controls';
import { components, connections } from './config';

class ArchitectureDiagram {
  private sceneSetup: SceneSetup;
  private componentRenderer: ComponentRenderer;
  private connectionRenderer: ConnectionRenderer;
  private controls: CameraControls;
  private componentPositions = new Map<string, THREE.Vector3>();

  constructor() {
    this.sceneSetup = new SceneSetup();
    this.componentRenderer = new ComponentRenderer(this.sceneSetup.scene);
    this.connectionRenderer = new ConnectionRenderer(this.sceneSetup.scene);
    this.controls = new CameraControls(this.sceneSetup.camera, this.sceneSetup.renderer.domElement);
    
    this.init();
    this.animate();
  }

  private init() {
    // Create all components
    components.forEach(config => {
      this.componentRenderer.createComponent(config);
      this.componentPositions.set(config.name, new THREE.Vector3(...config.position));
    });

    // Create connections between components
    this.connectionRenderer.createConnections(connections, this.componentPositions);

    // Add background grid
    this.addGrid();
    
    // Add legend
    this.addLegend();
  }

  private addGrid() {
    const size = 50;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x444444, 0x222222);
    gridHelper.position.y = -5;
    this.sceneSetup.scene.add(gridHelper);
  }

  private addLegend() {
    const legendItems = [
      { color: '#4CAF50', label: 'Client Layer' },
      { color: '#FF9800', label: 'Gateway Layer' },
      { color: '#2196F3', label: 'Service Layer' },
      { color: '#F44336', label: 'Security Layer' },
      { color: '#9C27B0', label: 'Database Layer' },
      { color: '#FFD700', label: 'Blockchain Layer' }
    ];

    legendItems.forEach((item, index) => {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshLambertMaterial({ color: item.color });
      const cube = new THREE.Mesh(geometry, material);
      
      cube.position.set(-12, 6 - index * 1.2, 0);
      this.sceneSetup.scene.add(cube);

      // Add text label (simplified for this example)
      const textGeometry = new THREE.PlaneGeometry(2, 0.3);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 32;
      const context = canvas.getContext('2d')!;
      context.fillStyle = 'white';
      context.font = '16px Arial';
      context.fillText(item.label, 10, 20);
      
      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true 
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-10.5, 6 - index * 1.2, 0);
      this.sceneSetup.scene.add(textMesh);
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    
    // Update animations
    this.componentRenderer.animateComponents();
    this.connectionRenderer.animateConnections();
    this.controls.update();
    
    // Render scene
    this.sceneSetup.render();
  }
}

// Initialize the application
new ArchitectureDiagram();
