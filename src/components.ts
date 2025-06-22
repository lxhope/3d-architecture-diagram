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
    
    // Create main box
    const geometry = new THREE.BoxGeometry(...config.size);
    const material = new THREE.MeshLambertMaterial({ 
      color: config.color,
      transparent: true,
      opacity: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Add wireframe outline
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ 
      color: 0xffffff, 
      opacity: 0.3,
      transparent: true 
    }));
    
    // Create label
    const label = this.createLabel(config.name, config.type);
    label.position.y = config.size[1] / 2 + 0.5;
    
    // Add components to group
    group.add(mesh);
    group.add(line);
    group.add(label);
    
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
    
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;
    
    // Configure text style
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = 'white';
    context.font = 'Bold 16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Draw text
    context.fillText(text, canvas.width / 2, canvas.height / 2 - 5);
    context.font = '12px Arial';
    context.fillStyle = '#cccccc';
    context.fillText(`[${type}]`, canvas.width / 2, canvas.height / 2 + 15);
    
    // Create texture and material
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create plane for text
    const geometry = new THREE.PlaneGeometry(2, 0.5);
    const plane = new THREE.Mesh(geometry, material);
    
    labelGroup.add(plane);
    return labelGroup;
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
    const time = Date.now() * 0.001;
    
    this.components.forEach((component, _name) => {
      // Subtle floating animation
      component.position.y += Math.sin(time + component.position.x) * 0.005;
      
      // Gentle rotation for blockchain components
      if (component.userData.type === ComponentType.BLOCKCHAIN) {
        component.rotation.y += 0.005;
      }
    });
  }
}
