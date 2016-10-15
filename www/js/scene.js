var camera, scene, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('example');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  scene = new THREE.Scene();
  scene.add(new THREE.AxisHelper(2000));

  // CAMERA
  var SCREEN_WIDTH = window.innerWidth,
      SCREEN_HEIGHT = window.innerHeight;

  var VIEW_ANGLE = 120, // 90
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
      NEAR = 1,
      FAR = 100000; // 100000

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  // camera.position.set(0,10,0); // TODO
  camera.position.set(0, 0, 0);
  camera.lookAt(scene.position);

  var crateTextureNew = THREE.ImageUtils.loadTexture('img/bunny.jpg');
  var boxGeometryNew = new THREE.BoxGeometry(imageWidth, imageHeight, 1);

  // center of the image
  var centreX = 0;
  var centreY = 0;

  var numberOfImages = 8;
  for (var i = 0; i < numberOfImages; i++) {
    var crateMaterialNew = new THREE.MeshBasicMaterial({map: crateTextureNew, color: Math.random() * 0xffffff});
    var boxNew = new THREE.Mesh(boxGeometryNew, crateMaterialNew);

    var r = imageWidth / (2 * Math.sin(Math.PI / numberOfImages));
    var x = centreX + r * Math.sin(2 * Math.PI * i / numberOfImages);
    var y = centreY + r * Math.cos(2 * Math.PI * i / numberOfImages);

    boxNew.position.set(x, 0, y);
    boxNew.rotateY(i * 2 * Math.PI / numberOfImages);
    scene.add(boxNew);
  }

  controls = new THREE.OrbitControls(camera, element);
  controls.rotateLeft(Math.PI / 2);
  controls.target.set(
      camera.position.x + 0.1,
      camera.position.y,
      camera.position.z
  );
  controls.noZoom = true;
  controls.noPan = true;

  function setOrientationControls(e) {
    console.log('setOrientationControls');
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }

  window.addEventListener('deviceorientation', setOrientationControls, true);

  var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function resize() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  effect.setSize(width, height);
}

function update(dt) {
  resize();

  camera.updateProjectionMatrix();

  controls.update(dt);
}

function render(dt) {
  effect.render(scene, camera);
}

function animate(t) {
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}
