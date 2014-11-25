var Blowup = {
  coefficient_: 2,
  canvas_: null,
  diameter_: 90,
  canvas_backend_: null,
  id_: 'blowup',
  retina_subfix_: '-retina',

  setup: function() {
    var image = document.getElementById(this.id_);
    image.onload = function() {
      Blowup.init();
    }
    image.onmousedown = function(e) {
      var radius = Blowup.diameter_ / 2;

      var x = e.pageX;
      var y = e.pageY;

      Repeater.do();

      var x_offset = x - this.x;
      var y_offset = y - this.y;

      if (x_offset > this.width - radius)
        x_offset = this.width - radius;

      if (y_offset > this.height - radius)
        y_offset = this.height - radius;

      x_offset *= Blowup.coefficient();
      y_offset *= Blowup.coefficient();

      x_offset -= radius;
      if (x_offset < radius)
        x_offset = radius;

      y_offset -= radius;
      if (y_offset < radius)
        y_offset = radius;

      Blowup.canvas_.style.left = x - radius + 'px';
      Blowup.canvas_.style.top = y - radius + 'px';

      var c = Blowup.canvas_.getContext('2d');
      // without this line when continuously draw, you'll get low quality image
      c.globalCompositeOperation = 'source-over';

      c.fillRect(-1, -1, Blowup.diameter_ + 1, Blowup.diameter_ + 1);
      c.globalCompositeOperation = 'xor';

      c.beginPath();
      c.arc(Blowup.diameter_ / 2, Blowup.diameter_ / 2, Blowup.diameter_ / 2, 0, Math.PI * 2, true);
      c.closePath();
      c.fill();

      c.drawImage(Blowup.canvas_backend_, x_offset, y_offset, Blowup.diameter_, Blowup.diameter_, 0, 0, Blowup.diameter_, Blowup.diameter_);
    }
  },

  init: function() {
    this.createCanvas();
    this.createCanvasBackend();
    this.draw();
  },

  coefficient: function() {
    var image = document.getElementById(this.id_);
    var coefficient = image.getAttribute('coefficient');
    if (coefficient != null && coefficient != "") {
      // whether should use regex to validate digit or not ?
      this.set_coefficient(coefficient);
    }
    return this.coefficient_;
  },

  set_coefficient: function(c) {
    this.coefficient_ = c;
  },

  createCanvas: function() {
    this.canvas_ = document.createElement('canvas');
    this.canvas_.width = this.diameter_;
    this.canvas_.height = this.diameter_;
    this.canvas_.style.position = 'absolute';

    document.body.appendChild(this.canvas_);
  },

  createCanvasBackend: function() {
    this.canvas_backend_ = document.createElement('canvas');
    var size = this.getImageSize();
    var coefficient = this.coefficient();
    this.canvas_backend_.width = size.width * coefficient;
    this.canvas_backend_.height = size.height * coefficient;
  },

  getImageSize: function() {
    var image = document.getElementById(this.id_);
    var size = { 'width': image.clientWidth, 'height': image.clientHeight};
    return size;
  },

  getRetinaImage: function() {
    var image = document.getElementById(this.id_);
    var file_name = image.getAttribute('src');

    // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
    var rule = /(?:\.([^.]+))?$/;
    var type = rule.exec(file_name)[1];
    var name = file_name.substr(0, file_name.length - type.length - 1);
    return name + this.retina_subfix_ + '.' + type;
  },

  draw: function() {
    var context = this.canvas_backend_.getContext('2d');
    var c = this.canvas_.getContext('2d');
    var image = new Image();

    image.onload = function() {
      context.drawImage(image, 0, 0, Blowup.canvas_backend_.width, Blowup.canvas_backend_.height);
    };
    image.src = this.getRetinaImage();
  },
};
