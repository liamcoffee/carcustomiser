
import {
	THREE,
	CarControls,
	DRACOLoader,
	GLTFLoader,
	PMREMCubeUVPacker,
	PMREMGenerator
  } from "threejs_react";
import React, {Component} from "react";
import ReactDOM from "react-dom";

import BodyColor from "./BodyColor";
import DetailColor from "./DetailColor";
import GlassColor from "./GlassColor";
import Drive from "./Drive";



class App extends Component {
	constructor(props) {
        super(props);
        this.envMap = null;
        this.clock = new THREE.Clock();
        this.carControls = new CarControls();
        this.carParts = {
            body: [],
            rim: [],
            glass: [],
        };
        this.damping = 5.0;
        this.distance = 5;
        this.cameraTarget = new THREE.Vector3();
        this.onWindowResize = () => {
            this.camera.aspect = (window.innerWidth / window.innerHeight);
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            console.log(window.innerWidth, window.innerHeight);
            console.log(document.body.clientWidth, document.body.clientHeight);
        };
        this.carControls.turningRadius = 75;
        this.state = {
            followCamera: false,
            materialsLib: {
                main: [],
                glass: [],
            },
            bodySelectIndex: 0,
            detailSelectIndex: 0,
            glassSelectIndex: 0,
        };
    }
    componentDidMount() {
        this.init();
    }
    async init() {
        const container = document.getElementById('container');
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
        this.camera.position.set(3.25, 2.0, -5);
        this.camera.lookAt(0, 0.5, 0);
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xd7cbb1, 1, 80);
        console.log(this.scene);
        let light = new THREE.HemisphereLight(0xffffff, 0x444444);
        light.position.set(0, 20, 0);
        // this.scene.add( light );
        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 20, 10);
        // this.scene.add( light );
        const urls = ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'];
        let loader = new THREE.CubeTextureLoader();
		loader.setPath('./textures/cube/skyboxsun25deg/');
		console.log('loading');
        await loader.load(urls, (texture) => {
            console.log("the texture is" + texture);
            this.scene.background = texture;
            console.log(this.scene);
            this.pmremGenerator = new PMREMGenerator(texture);
            this.pmremGenerator.update(this.renderer);
            this.pmremCubeUVPacker = new PMREMCubeUVPacker(this.pmremGenerator.cubeLods);
            this.pmremCubeUVPacker.update(this.renderer);
            console.log(this.pmremCubeUVPacker.CubeUVRenderTarget.texture);
            this.envMap = this.pmremCubeUVPacker.CubeUVRenderTarget.texture;
            console.log(this.envMap);
            this.pmremGenerator.dispose();
            this.pmremCubeUVPacker.dispose();
            this.initCar();
            this.initMaterials();
        });
        console.log(loader);
        let grid = new THREE.GridHelper(400, 40, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.depthWrite = false;
        grid.material.transparent = true;
        this.scene.add(grid);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.gammaOutput = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        console.log(this.camera);
        console.log(this.renderer);
        container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.onWindowResize, false);
        this.animation();
    }
    initCar() {
		DRACOLoader.setDecoderPath('./js/libs/draco/gltf/');
		console.log("rendering car");
        const loader = new GLTFLoader();
        loader.setDRACOLoader(new DRACOLoader());
        loader.load('/models/ferrari.glb', (gltf) => {
            console.log(gltf.scene.children[0]);
            this.carModel = gltf.scene.children[0];
            this.carControls.setModel(this.carModel, null);
            this.carModel.traverse((child) => {
                if (child.isMesh) {
                    child.material.envMap = this.envMap;
                }
            });
            // shadow
            const texture = new THREE.TextureLoader().load('/models/ferrari_ao.png');
            const shadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(0.655 * 4, 1.3 * 4).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: texture, opacity: 0.8, transparent: true }));
            shadow.renderOrder = 2;
            this.carModel.add(shadow);
            this.scene.add(this.carModel);
            // car parts for material selection
            this.carParts.body.push(this.carModel.getObjectByName('body'));
            this.carParts.rim.push(this.carModel.getObjectByName('rim_fl'), this.carModel.getObjectByName('rim_fr'), this.carModel.getObjectByName('rim_rr'), this.carModel.getObjectByName('rim_rl'), this.carModel.getObjectByName('trim'));
            this.carParts.glass.push(this.carModel.getObjectByName('glass'));
            this.updateMaterials();
        });
    }
    initMaterials() {
        let materialsLib = {
            main: [
                new THREE.MeshStandardMaterial({
                    color: 0xff4400, envMap: this.envMap, metalness: 0.9, roughness: 0.2, name: 'Orange'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x001166, envMap: this.envMap, metalness: 0.9, roughness: 0.2, name: 'Blue'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x990000, envMap: this.envMap, metalness: 0.9, roughness: 0.2, name: 'Red'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x000000, envMap: this.envMap, metalness: 0.9, roughness: 0.5, name: 'Black'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0xffffff, envMap: this.envMap, metalness: 0.9, roughness: 0.5, name: 'White'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x555555, envMap: this.envMap, envMapIntensity: 2.0, metalness: 1.0,
                    roughness: 0.2, name: 'Metallic'
                }),
            ],
            glass: [
                new THREE.MeshStandardMaterial({
                    color: 0xffffff, envMap: this.envMap, metalness: 1, roughness: 0,
                    // tslint:disable-next-line: max-line-length
                    opacity: 0.2, transparent: true, premultipliedAlpha: true, name: 'Clear'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x000000, envMap: this.envMap, metalness: 1, roughness: 0,
                    // tslint:disable-next-line: max-line-length
                    opacity: 0.2, transparent: true, premultipliedAlpha: true, name: 'Smoked'
                }),
                new THREE.MeshStandardMaterial({
                    color: 0x001133, envMap: this.envMap, metalness: 1, roughness: 0,
                    opacity: 0.2, transparent: true, premultipliedAlpha: true, name: 'Blue'
                }),
            ],
        };
        this.setState({
            materialsLib: materialsLib
        });
    }
    updateMaterials() {
        const e1 = { target: { value: 3 } };
        this.handleChange(e1);
        const e2 = { target: { value: 5 } };
        this.handleDetailChange(e2);
        const e3 = { target: { value: 0 } };
        this.handleGlassChange(e3);
    }
    animation() {
        this.update();
        requestAnimationFrame(() => this.animation());
    }
    update() {
        const delta = this.clock.getDelta();
        const { followCamera } = this.state;
        if (this.carModel) {
            this.carControls.update(delta / 3);
            if (this.carModel.position.length() > 200) {
                this.carModel.position.set(0, 0, 0);
                this.carControls.speed = 0;
            }
            if (followCamera) {
                this.carModel.getWorldPosition(this.cameraTarget);
                this.cameraTarget.y = 2.5;
                this.cameraTarget.z += this.distance;
                this.camera.position.lerp(this.cameraTarget, delta * this.damping);
            }
            else {
                this.carModel.getWorldPosition(this.cameraTarget);
                this.cameraTarget.y += 0.5;
                this.camera.position.set(3.25, 2.0, -5);
            }
            this.camera.lookAt(this.carModel.position);
        }
        this.renderer.render(this.scene, this.camera);
    }
    handleChange = (event) => {
        console.log("events firing" + event);
        const bodyMat = this.state.materialsLib.main[event.target.value];
        this.setState({
            bodySelectIndex: event.target.value
        });
        this.carParts.body.forEach(part => part.material = bodyMat);
    }
  
    
    handleDetailChange = (event) => {
        console.log(event);
        const bodyMat = this.state.materialsLib.main[event.target.value];
        this.setState({
            detailSelectIndex: event.target.value
        });
        this.carParts.rim.forEach(part => part.material = bodyMat);
    }
 
    
    handleGlassChange = (event) => {
        console.log(event);
        const bodyMat = this.state.materialsLib.glass[event.target.value];
        this.setState({
            glassSelectIndex: event.target.value
        });
        this.carParts.glass.forEach(part => part.material = bodyMat);
    }
  
    handleDriveChange = (event) => {
        const val = !this.state.followCamera;
        this.setState({
            followCamera: val,
        });
    }
   
    render() {
        return (
			<div className="customiser">
				<div className="controls">
					<span className="title">Customise:</span>
					<BodyColor material={this.state.materialsLib.main} bodyValue={this.state.bodySelectIndex} bodyChange={this.handleChange}  />
					<DetailColor material={this.state.materialsLib.main} detailValue={this.state.detailSelectIndex} detailChange={this.handleDetailChange} />
					<GlassColor material={this.state.materialsLib.glass} glassValue={this.state.glassSelectIndex} glassChange={this.handleGlassChange} />
					<Drive checked={this.state.followCamera}  driveChange={this.handleDriveChange} />
					<div className="dInstrutions">
						Use arrow keys to drive, space to break
					</div>
				</div>
				
				<div id="container" className="pos"></div>
			</div>
			
		);
	}
}

export default App;
