import * as THREE from 'three';
import { ComponentConfig, ComponentType } from './types';

export class ComponentRenderer {
  private scene: THREE.Scene;
  private components: Map<string, THREE.Group> = new Map();
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.setupEventListeners();
  }

  public createComponent(config: ComponentConfig): THREE.Group {
    const group = new THREE.Group();
    
    // Create beautiful rounded box with enhanced materials
    const geometry = new THREE.BoxGeometry(...config.size);
    
    // Enhanced material with better visual properties
    const material = new THREE.MeshPhongMaterial({ 
      color: config.color,
      transparent: true,
      opacity: 0.9,
      shininess: 100,
      specular: 0x444444,
      emissive: new THREE.Color(config.color).multiplyScalar(0.1)
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Add subtle edge highlighting instead of wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff, 
      opacity: 0.6,
      transparent: true,
      linewidth: 2
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    
    // Add subtle glow effect
    const glowGeometry = new THREE.BoxGeometry(
      config.size[0] * 1.05, 
      config.size[1] * 1.05, 
      config.size[2] * 1.05
    );
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    
    // Create enhanced label
    const label = this.createLabel(config.name, config.type);
    label.position.y = config.size[1] / 2 + 0.8;
    
    // Add components to group
    group.add(glowMesh);  // Glow first (background)
    group.add(mesh);      // Main component
    group.add(edgeLines); // Edge highlights
    group.add(label);     // Label on top
    
    // Set position
    group.position.set(...config.position);
    
    // Store reference
    group.userData = { name: config.name, type: config.type };
    this.components.set(config.name, group);
    
    // Add to scene
    this.scene.add(group);
    
    return group;
  }

  private createLabel(text: string, type: ComponentType): THREE.Group {
    const labelGroup = new THREE.Group();
    
    // Create canvas for enhanced text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 128;
    
    // Enhanced text styling with gradient background
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(1, 'rgba(240, 240, 240, 0.95)');
    
    // Rounded rectangle background
    const cornerRadius = 10;
    context.fillStyle = gradient;
    this.roundRect(context, 10, 10, canvas.width - 20, canvas.height - 20, cornerRadius);
    context.fill();
    
    // Add subtle border
    context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    context.lineWidth = 2;
    this.roundRect(context, 10, 10, canvas.width - 20, canvas.height - 20, cornerRadius);
    context.stroke();
    
    // Enhanced text rendering
    context.fillStyle = '#333333';
    context.font = 'Bold 24px Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Draw main text with shadow
    context.shadowColor = 'rgba(0, 0, 0, 0.3)';
    context.shadowBlur = 2;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.fillText(text, canvas.width / 2, canvas.height / 2 - 8);
    
    // Draw type label
    context.shadowColor = 'transparent';
    context.font = '16px Arial, sans-serif';
    context.fillStyle = '#666666';
    context.fillText(`[${type}]`, canvas.width / 2, canvas.height / 2 + 20);
    
    // Create texture and material
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create plane for text with better proportions
    const geometry = new THREE.PlaneGeometry(3, 0.75);
    const plane = new THREE.Mesh(geometry, material);
    
    labelGroup.add(plane);
    return labelGroup;
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  private setupEventListeners() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('click', (event) => {
      this.onComponentClick(event);
    });
  }

  private onComponentClick(_event: MouseEvent) {
    this.raycaster.setFromCamera(this.mouse, this.scene.children[0] as any);
    
    const intersects = this.raycaster.intersectObjects(
      Array.from(this.components.values()).map(group => group.children[0]),
      false
    );
    
    if (intersects.length > 0) {
      const component = intersects[0].object.parent as THREE.Group;
      this.highlightComponent(component);
    }
  }

  private highlightComponent(component: THREE.Group) {
    // Reset all components
    this.components.forEach(comp => {
      const mesh = comp.children[0] as THREE.Mesh;
      const material = mesh.material as THREE.MeshLambertMaterial;
      material.opacity = 0.8;
    });
    
    // Highlight selected component
    const mesh = component.children[0] as THREE.Mesh;
    const material = mesh.material as THREE.MeshLambertMaterial;
    material.opacity = 1.0;
    
    // Show info
    console.log(`Selected: ${component.userData.name} (${component.userData.type})`);
  }

  public animateComponents() {
    // Animations removed for static display
  }
}
