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
    // Enhanced grid with better visibility
    const size = 40;
    const divisions = 40;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x00aaff, 0x003366);
    gridHelper.position.y = -5;
    gridHelper.material.opacity = 0.6;
    gridHelper.material.transparent = true;
    this.sceneSetup.scene.add(gridHelper);

    // Add glowing layer separators
    const layerHeights = [10, 7, 4, 1, -2];
    layerHeights.forEach((height, index) => {
      const geometry = new THREE.RingGeometry(8, 12, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: index % 2 === 0 ? 0x0088ff : 0x00ff88,
        transparent: true, 
        opacity: 0.15,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = height - 0.5;
      this.sceneSetup.scene.add(ring);
    });

    // Add subtle fog for depth
    this.sceneSetup.scene.fog = new THREE.Fog(0x0a0a0a, 25, 60);
  }

  private addLegend() {
    const legendItems = [
      { color: '#00ff88', label: 'Client Layer' },
      { color: '#ff6600', label: 'Gateway Layer' },
      { color: '#0088ff', label: 'Service Layer' },
      { color: '#ff3366', label: 'Security Layer' },
      { color: '#aa00ff', label: 'Database Layer' },
      { color: '#ffaa00', label: 'Blockchain Layer' }
    ];

    // Create legend background panel
    const panelGeometry = new THREE.PlaneGeometry(5, 10);
    const panelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.8
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(-13, 5, 0);
    this.sceneSetup.scene.add(panel);

    legendItems.forEach((item, index) => {
      // Enhanced legend cubes with glow
      const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
      const material = new THREE.MeshPhysicalMaterial({ 
        color: item.color,
        emissive: new THREE.Color(item.color).multiplyScalar(0.3),
        metalness: 0.1,
        roughness: 0.2
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      cube.position.set(-14.5, 8 - index * 1.5, 0);
      this.sceneSetup.scene.add(cube);

      // Enhanced text labels
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const context = canvas.getContext('2d')!;
      
      context.fillStyle = 'rgba(255, 255, 255, 0.95)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.fillStyle = '#333333';
      context.font = 'Bold 18px Arial, sans-serif';
      context.textAlign = 'left';
      context.textBaseline = 'middle';
      context.fillText(item.label, 15, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true 
      });
      const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.75), textMaterial);
      textMesh.position.set(-11.5, 8 - index * 1.5, 0);
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
