import * as THREE from 'three';

export class SceneSetup {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: any;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
    this.init();
  }

  private init() {
    // Set up renderer with enhanced quality
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0a0a0a); // Darker background for better contrast
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    document.body.appendChild(this.renderer.domElement);

    // Set up camera for hierarchical view
    this.camera.position.set(0, 3, 20);
    this.camera.lookAt(0, 3, 0);

    // Add lights
    this.addLights();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private addLights() {
    // Enhanced ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    this.scene.add(ambientLight);

    // Main directional light with enhanced shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(15, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    this.scene.add(directionalLight);

    // Accent lights for dramatic effect
    const accentLight1 = new THREE.SpotLight(0x00ff88, 0.8, 30, Math.PI / 6, 0.5);
    accentLight1.position.set(-8, 12, 8);
    accentLight1.target.position.set(0, 4, 0);
    this.scene.add(accentLight1);
    this.scene.add(accentLight1.target);

    const accentLight2 = new THREE.SpotLight(0x0088ff, 0.8, 30, Math.PI / 6, 0.5);
    accentLight2.position.set(8, 12, 8);
    accentLight2.target.position.set(0, 4, 0);
    this.scene.add(accentLight2);
    this.scene.add(accentLight2.target);

    // Rim light for better definition
    const rimLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    rimLight.position.set(-10, 5, -10);
    this.scene.add(rimLight);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }
}
