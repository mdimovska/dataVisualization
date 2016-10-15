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

  camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
  camera.position.set(0, 10, 0);
  scene.add(camera);



  // var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
  //   map:THREE.ImageUtils.loadTexture('../img/bunny.jpg')
  // });
  // img.map.needsUpdate = true; //ADDED
  //
  // // plane
  // var plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200),img);
  // plane.overdraw = true;
  // scene.add(plane);




  var texture = THREE.ImageUtils.loadTexture(
      'textures/patterns/grass2.png'
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(50, 50);
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading,
    map: texture
  });

  var crateTexture = THREE.ImageUtils.loadTexture( 'img/bunny.jpg' );
    var crateMaterial = new THREE.MeshBasicMaterial( { map: crateTexture, color: 0xf2a5f1} );
    var crateMaterial2 = new THREE.MeshBasicMaterial( { map: crateTexture, color: 0x0ac2b9} );
    var crateMaterial3 = new THREE.MeshBasicMaterial( { map: crateTexture, color: 0x0000ff} );
    var crateMaterial4 = new THREE.MeshBasicMaterial( { map: crateTexture, color: 0xc20a13 } );
    var crateMaterial5 = new THREE.MeshBasicMaterial( { map: crateTexture, color: 0xf0a630 } );
    var crateMaterial6 = new THREE.MeshBasicMaterial( { map: crateTexture, color: 0xffffff } );
    var crateMaterial7 = new THREE.MeshBasicMaterial( { map: crateTexture, color: 0x720ac2 } );
    var crateMaterial8 = new THREE.MeshBasicMaterial( { map: crateTexture, color: 0x00ff00 } );


  var boxGeometry = new THREE.BoxGeometry(10,5,1);
  var box = new THREE.Mesh(boxGeometry, crateMaterial);
  var box1up = new THREE.Mesh(boxGeometry, crateMaterial2);
  var box2up = new THREE.Mesh(boxGeometry, crateMaterial3);
  var box3up = new THREE.Mesh(boxGeometry, crateMaterial4);
  var box4up = new THREE.Mesh(boxGeometry, crateMaterial5);
  var box2 = new THREE.Mesh(boxGeometry, crateMaterial6);
  var box3 = new THREE.Mesh(boxGeometry, crateMaterial7);
  var box4 = new THREE.Mesh(boxGeometry, crateMaterial8);
  box.castShadow = true;

  box.position.set(6, 12, 6);
  box1up.position.set(5, 17, 5);
  box2.position.set(-6, 12, 6);
  box2up.position.set(-5, 17, 5);
  box3.position.set(6, 12, -6);
  box3up.position.set(5, 17, -5);
  box4.position.set(-6, 12, -6);
  box4up.position.set(-5, 17, -5);

  var axis = new THREE.Vector3(1 , 0, 0);

  box.rotation.y = Math.PI / 4;
  box1up.rotation.y = Math.PI / 4;
  box1up.rotateOnAxis(axis, -Math.PI / 8);

  box2.rotation.y = -Math.PI / 4;
  box2up.rotation.y = -Math.PI / 4;
  box2up.rotateOnAxis(axis, -Math.PI / 8);

  box3.rotation.y = -Math.PI / 4;
  box3up.rotation.y = -Math.PI / 4;
  box3up.rotateOnAxis(axis, Math.PI / 8);

  box4.rotation.y = Math.PI / 4;
  box4up.rotation.y = Math.PI / 4;
  box4up.rotateOnAxis(axis, Math.PI / 8);


  scene.add(box);
  scene.add(box1up);
  scene.add(box2);
  scene.add(box2up);
  scene.add(box3);
  scene.add(box3up);
  scene.add(box4);
  scene.add(box4up);

  controls = new THREE.OrbitControls(camera, element);
  controls.rotateUp(Math.PI / 4);
  controls.target.set(
      camera.position.x + 0.1,
      camera.position.y,
      camera.position.z
  );
  controls.noZoom = true;
  controls.noPan = true;

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);


  var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  var texture = THREE.ImageUtils.loadTexture(
      'textures/patterns/grass2.png'
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(50, 50);
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading,
    map: texture
  });

  var geometry = new THREE.PlaneGeometry(1000, 1000);

  var mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
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

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}
