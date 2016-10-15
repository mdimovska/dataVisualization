demo = {};

demo.Treemap3d = function () {

  "use strict";

  // var _width          = 500,
  //     _height         = 500,
  var _width = window.innerWidth,
      _height = window.innerHeight,
      _renderer = null,
      _controls = null,
      _scene = null,
  // _camera         = new THREE.PerspectiveCamera(45, _width/_height , 1, 10000),
      _camera = null,
      _zmetric = "size",
      _colorScale = d3.scale.category20c(),
      _zscaleSize = d3.scale.linear().range([0, window.innerWidth]),
      _zscaleCost = d3.scale.linear().range([0, window.innerHeight]),
      _buttonBarDiv = null,
      _elements = null,
      _boxMap = {},
      effect;

  function Treemap3d(selection) {
    _renderer = Modernizr.webgl ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();
    // _renderer.setSize(_width, _height);
    _renderer.setClearColor(0xFFFFFF);
    // _renderer.domElement.style.position = 'absolute';
    _renderer.shadowMapEnabled = true;
    _renderer.shadowMapSoft = true;
    _renderer.shadowMapType = THREE.PCFShadowMap;
    _renderer.shadowMapAutoUpdate = true;

    selection.node().appendChild(_renderer.domElement);

    effect = new THREE.StereoEffect(_renderer); //

    _scene = new THREE.Scene();

    // _camera = new THREE.PerspectiveCamera(90, 1, 1000.001, 700);
    _camera         = new THREE.PerspectiveCamera(45, _width/_height , 1, 10000),
    // _camera.setLens(100);
    // _camera.position.set(-1000, -5000, 2000);
    _camera.position.set(0, 10, 0); //
    _scene.add(_camera);


    var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
    _scene.add(light);


    _buttonBarDiv = selection.append("div")
        .attr("class", "controls");
    _buttonBarDiv.append("button")
        .text("ZScale: 0")
        .on("click", function () {
          _zmetric = "base";
          transform();
        });
    _buttonBarDiv.append("button")
        .text("ZScale: Size")
        .on("click", function () {
          _zmetric = "size";
          transform();
        });
    _buttonBarDiv.append("button")
        .text("ZScale: Cost")
        .on("click", function () {
          _zmetric = "cost";
          transform();
        });

    function enterHandler(d) {
      var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      var boxMaterial = new THREE.MeshLambertMaterial({color: _colorScale(d.name)});
      var box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.castShadow = true;
      _boxMap[d.id] = box;
      _scene.add(box);
    }

    function updateHandler(d) {
      var duration = 1000;
      var zvalue = (_zmetric === "size" ? _zscaleSize(d.size) : (_zmetric === "cost" ? _zscaleCost(d.cost) : 50));
      var box = _boxMap[d.id];
      box.material.color.set(_colorScale(d.name));
      var newMetrics = {
        x: d.x + (d.dx / 2) - _width / 2,
        y: d.y + (d.dy / 2) - _height / 2,
        z: zvalue / 2,
        w: Math.max(0, d.dx - 1),
        h: Math.max(0, d.dy - 1),
        d: zvalue
      };
      var coords = new TWEEN.Tween(box.position)
          .to({x: newMetrics.x, y: newMetrics.y, z: newMetrics.z}, duration)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .start();

      var dims = new TWEEN.Tween(box.scale)
          .to({x: newMetrics.w, y: newMetrics.h, z: newMetrics.d}, duration)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .start();

      var newRot = box.rotation;
      var rotate = new TWEEN.Tween(box.rotation)
          .to({x: newRot.x, y: newRot.y, z: newRot.z}, duration)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .start();

      var update = new TWEEN.Tween(this)
          .to({}, duration)
          .onUpdate(_.bind(render, this))
          .start();
    }

    function exitHandler(d) {
      var box = _boxMap[d.id];
      _scene.remove(box);
      delete _boxMap[d.id];
    }

    function transform() {
      TWEEN.removeAll();
      _elements.each(updateHandler);
    }

    function render() {
      // effect.render(_scene, _camera);
      effect.render(_scene, _camera);
    }

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
      _controls.update();
    }

    Treemap3d.load = function (data) {
      var treemap = d3.layout.treemap()
          .size([_width, _height])
          .sticky(true)
          .value(function (d) {
            return d.size;
          });
      _zscaleSize.domain(d3.extent(data.children, function (d) {
        return d.size;
      }));
      _zscaleCost.domain(d3.extent(data.children, function (d) {
        return d.cost;
      }));

      _elements = selection.datum(data).selectAll(".node")
          .data(treemap.nodes);

      _elements.enter().append("div")
          .attr("class", "node")
          .each(enterHandler);

      _elements.exit().each(exitHandler).remove();

      render();
      animate();
      transform();
    };

    var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    directionalLight.position.set(-1000, -2000, 4000);
    _scene.add(directionalLight);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x313131);
    _scene.add(ambientLight);

    //_controls = new THREE.OrbitControls(_camera, _renderer.domElement);
    _controls = new THREE.TrackballControls(_camera, _renderer.domElement);
    _controls.staticMoving = true;
    _controls.minDistance = 100;
    _controls.maxDistance = 6000;
    _controls.rotateSpeed = 1.5;
    _controls.zoomSpeed = 1.5;
    _controls.panSpeed = 0.5;
    _controls.addEventListener('change', render);


    window.addEventListener("resize", resize, false);

    function resize() {
      var newWidth  = window.innerWidth,
          newHeight = window.innerHeight;
      // var newWidth = selection.offsetWidth, //
      //     newHeight = selection.offsetHeight; //
      _renderer.setSize(newWidth, newHeight);
      effect.setSize(newWidth, newHeight); //
      _camera.aspect = newWidth / newHeight;
      _camera.updateProjectionMatrix();
    }

    setTimeout(resize, 1);
  }

  return Treemap3d;
};

d3.json("http://www.billdwhite.com/wordpress/wp-content/data/treemap3d.json", function (error, data) {
  var treemap3d = demo.Treemap3d();
  d3.select("#container_pehomu").append("div")
  // .style("position", "relative")
      .call(treemap3d);
  treemap3d.load(data);

  // var  container = document.getElementById('example');
  // var treemap3d = demo.Treemap3d(container);
  // treemap3d.load(data);
});

