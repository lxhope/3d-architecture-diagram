import * as THREE from 'three';

export class CameraControls {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private isMouseDown = false;
  private mouseStart = new THREE.Vector2();
  private mouseEnd = new THREE.Vector2();
  private spherical = new THREE.Spherical();
  private target = new THREE.Vector3(0, 3, 0);
  private distance = 20;
  private minDistance = 5;
  private maxDistance = 50;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    
    this.spherical.setFromVector3(this.camera.position.clone().sub(this.target));
    this.distance = this.spherical.radius;
    
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.domElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
    this.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
    this.domElement.addEventListener('mouseup', () => this.onMouseUp());
    this.domElement.addEventListener('wheel', (event) => this.onWheel(event));
    this.domElement.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  private onMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    this.mouseStart.set(event.clientX, event.clientY);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isMouseDown) return;

    this.mouseEnd.set(event.clientX, event.clientY);
    const delta = this.mouseEnd.clone().sub(this.mouseStart);

    if (event.button === 0 || event.buttons === 1) {
      // Left mouse button - rotate
      this.rotate(delta.x * 0.01, delta.y * 0.01);
    } else if (event.button === 2 || event.buttons === 2) {
      // Right mouse button - pan
      this.pan(delta.x * 0.01, delta.y * 0.01);
    }

    this.mouseStart.copy(this.mouseEnd);
  }

  private onMouseUp() {
    this.isMouseDown = false;
  }

  private onWheel(event: WheelEvent) {
    const delta = event.deltaY > 0 ? 1.1 : 0.9;
    this.zoom(delta);
    event.preventDefault();
  }

  private rotate(deltaX: number, deltaY: number) {
    this.spherical.theta -= deltaX;
    this.spherical.phi += deltaY;
    this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));
    this.updateCamera();
  }

  private pan(deltaX: number, deltaY: number) {
    const offset = new THREE.Vector3();
    offset.copy(this.camera.position).sub(this.target);

    const targetDistance = offset.length() * Math.tan((this.camera.fov / 2) * Math.PI / 180);
    const panX = deltaX * targetDistance / this.domElement.clientHeight * 2;
    const panY = deltaY * targetDistance / this.domElement.clientHeight * 2;

    const right = new THREE.Vector3();
    right.setFromMatrixColumn(this.camera.matrix, 0);
    right.multiplyScalar(-panX);

    const up = new THREE.Vector3();
    up.setFromMatrixColumn(this.camera.matrix, 1);
    up.multiplyScalar(panY);

    this.target.add(right);
    this.target.add(up);
    this.updateCamera();
  }

  private zoom(delta: number) {
    this.distance *= delta;
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance));
    this.spherical.radius = this.distance;
    this.updateCamera();
  }

  private updateCamera() {
    const position = new THREE.Vector3();
    position.setFromSpherical(this.spherical);
    position.add(this.target);
    
    this.camera.position.copy(position);
    this.camera.lookAt(this.target);
  }

  public update() {
    // Called in animation loop if needed
  }
}
