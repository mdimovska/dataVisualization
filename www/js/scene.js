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
  // scene.add(new THREE.AxisHelper(2000));

  // CAMERA
  var SCREEN_WIDTH = window.innerWidth,
      SCREEN_HEIGHT = window.innerHeight;

  var VIEW_ANGLE = 120, // 90
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
      NEAR = 1,
      FAR = 100000; // 100000

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(0, 0, 0);
  camera.lookAt(scene.position);

  var imageWidth = 20;
  var imageHeight = 10;

  var crateTextureNew = THREE.ImageUtils.loadTexture('img/bunny.jpg');
  var boxGeometryNew = new THREE.BoxGeometry(imageWidth, imageHeight, 1);

  // center of the image
  var centreX = 0;
  var centreY = 0;

  var y = 0;
  var DISTANCE_Y = 3;
  var numberOfImages = 104;
  var MAX_NUMBER_OF_IMAGES_IN_ROW = 8;
  var maxNumberOfImagesInRow = MAX_NUMBER_OF_IMAGES_IN_ROW;
  if (numberOfImages < MAX_NUMBER_OF_IMAGES_IN_ROW && numberOfImages > 4) {
    // if there are 4 images or less, should not render them in a circle
    maxNumberOfImagesInRow = numberOfImages;
  }

  for (var i = 1; i <= numberOfImages; i++) {
    var crateMaterialNew = new THREE.MeshBasicMaterial({map: crateTextureNew, color: Math.random() * 0xffffff});
    var boxNew = new THREE.Mesh(boxGeometryNew, crateMaterialNew);

    if (i > MAX_NUMBER_OF_IMAGES_IN_ROW && i % MAX_NUMBER_OF_IMAGES_IN_ROW == 1) {
      y += DISTANCE_Y + imageHeight;
    }

    var radius = imageWidth / (2 * Math.sin(Math.PI / maxNumberOfImagesInRow));
    var x = centreX + radius * Math.sin(2 * Math.PI * i / maxNumberOfImagesInRow);
    var z = centreY + radius * Math.cos(2 * Math.PI * i / maxNumberOfImagesInRow);

    boxNew.position.set(x, y, z);
    boxNew.rotateY(i * 2 * Math.PI / maxNumberOfImagesInRow);
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

function render() {
  effect.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}
