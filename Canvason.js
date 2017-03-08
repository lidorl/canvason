//-----------------------------------
//      Init Canvason
//-----------------------------------
// var chart = new Canvason("canvas", {
//    width: 500,
//    height: 300,
//    Yrange: { min: 0, max: 700, steps: 10, sign: "%" },
//    Xrange: { min: 0, max: 1000, steps: 10, sign:"ms" }
// });


//-----------------------------------
//      Xrange\Yrange examples
//-----------------------------------
//      Yrange: { min: 0, max: 100, steps: 10, sign: "%" }
//      Xrange: { min: 0, max: 100, steps: 5, sign:"ms" }


//-----------------------------------
//      Series example
//-----------------------------------
// var Series = {
//    data: {
//        xValues: [0,100,200,400,600,900],
//        yValues: [250,250,100,150,250,400]
//    },
//    tag: {
//        text: "some tag"
//    },
//    style: {
//        color: "blue"
//    }
// }

//-----------------------------------
//      drawSeries example
//-----------------------------------
//chart.drawSeries({
//    data: {
//        xValues: [200, 700],
//        yValues: [500, 500]
//    },
//    tag: {
//        text: "Cancel"
//    },
//    style: {
//        color: "rgb(202, 60, 60)"
//    }
//});

var Canvason = function (canvasId, properties) {
    //init properties
    this.canvas = document.querySelector("#" + canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.properties = {
        width: properties.width,
        height: properties.height,
        Yrange: properties.Yrange,
        Xrange: properties.Xrange,
        OffsetTop: 40,
        OffsetLeft: 40
    }

    //set canvas element properties
    this.refresh();
    this.drawAxis();
    this.drawAxisY();
    this.drawAxisX();
}

Canvason.prototype.refresh = function () {
    this.canvas.width = this.properties.width;
    this.canvas.height = this.properties.height;
    this.properties.OffsetTop = this.properties.height * 0.10;
    this.properties.OffsetLeft = this.properties.width * 0.1;
    this.properties.OffsetBottom = this.properties.height * 0.9;
    this.properties.OffsetRight = this.properties.width - this.properties.OffsetLeft
    this.properties.LineOffset = Math.ceil((this.properties.OffsetBottom - this.properties.OffsetTop) / this.properties.Yrange.steps);
    this.properties.PointOffset = Math.ceil((this.properties.OffsetRight - this.properties.OffsetLeft) / this.properties.Xrange.steps);
}

Canvason.prototype.drawAxis = function () {
    var cvs = this.canvas;
    var ctx = this.ctx;
    var offsetTop = this.properties.OffsetTop;
    var offsetLeft = this.properties.OffsetLeft;
    var offsetRight = this.properties.OffsetRight;
    var offsetBottom = this.properties.OffsetBottom;
    var lineOffset = this.properties.LineOffset;
    var steps = this.properties.Yrange.steps;

    for (var i = 0; i <= steps; i++) {
        ctx.beginPath();
        ctx.moveTo(offsetLeft, offsetTop + (lineOffset * i));
        ctx.lineTo(offsetRight, offsetTop + (lineOffset * i));
        ctx.lineWidth = (i < (steps)) ? 0.3 : 1.5;
        ctx.stroke();
        ctx.closePath();
    }
    ctx.beginPath();
    ctx.moveTo(offsetLeft, offsetTop);
    ctx.lineTo(offsetLeft, offsetTop + (lineOffset * steps));
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.closePath();
}

Canvason.prototype.drawAxisY = function () {
    var min = this.properties.Yrange.min;
    var max = this.properties.Yrange.max;
    var steps = this.properties.Yrange.steps;
    var offsetLeft = this.properties.OffsetLeft * 0.4;
    var lineOffset = this.properties.LineOffset;
    var offsetTop = this.properties.OffsetTop;
    var offset = Math.floor(max / this.properties.Yrange.steps);
    var canvas = this.canvas;
    var ctx = this.ctx;
    var sign = this.properties.Yrange.sign;

    ctx.font = "11px Arial";
    ctx.textAlign = "left";
    ctx.fillText("[" + sign + "]", offsetLeft, offsetTop + (lineOffset * -0.8));
    for (var i = 0; i < steps; i++) {
        ctx.fillText(max - (offset * i), offsetLeft, offsetTop + (lineOffset * i));
    }
}

Canvason.prototype.drawAxisX = function () {
    var min = this.properties.Xrange.min;
    var max = this.properties.Xrange.max;
    var steps = this.properties.Xrange.steps;
    var offsetLeft = this.properties.OffsetLeft;
    var pointOffset = this.properties.PointOffset;
    var offsetTop = (this.properties.OffsetTop + (this.properties.LineOffset * this.properties.Yrange.steps)) * 1.05;
    var offset = Math.ceil(max / steps);
    var canvas = this.canvas;
    var ctx = this.ctx;
    var sign = this.properties.Xrange.sign;

    ctx.font = "11px Arial";
    ctx.textAlign = "center";
    ctx.fillText("[" + sign + "]", offsetLeft + (pointOffset * -0.7), offsetTop);
    for (var i = 0; i <= steps; i++) {
        ctx.fillText((offset * i), offsetLeft + (pointOffset * i), offsetTop);
    }
}

Canvason.prototype.drawSeries = function (series) {
    var offsetTop = this.properties.OffsetTop;
    var offsetLeft = this.properties.OffsetLeft;
    var data = series.data;
    var tag = series.tag;
    var style = series.style;
    var numOfPoint = data.xValues.length;
    var ctx = this.ctx;

    ctx.beginPath();
    ctx.strokeStyle = style.color;
    //draw first point
    var xValue = data.xValues[0];
    var yValue = data.yValues[0];
    //calc relative value (relative to the canvas drawing)
    var yRelValue = ((this.properties.Yrange.max - yValue) / this.properties.Yrange.max) * (this.properties.LineOffset * this.properties.Yrange.steps) + offsetTop;
    var xRelValue = (xValue / this.properties.Xrange.max) * (this.properties.PointOffset * this.properties.Xrange.steps) + offsetLeft;
    ctx.moveTo(xRelValue, yRelValue);

    //draw the tag
    if (tag != undefined) {
        ctx.textAlign = "left";
        ctx.fillText(tag.text, xRelValue, yRelValue * 0.97);
    }

    //draw the rest of the points
    for (var i = 1; i < numOfPoint; i++) {
        var xValue = data.xValues[i];
        var yValue = data.yValues[i];
        //calc relative value (relative to the canvas drawing)
        var yRelValue = ((this.properties.Yrange.max - yValue) / this.properties.Yrange.max) * (this.properties.LineOffset * this.properties.Yrange.steps) + offsetTop;
        var xRelValue = (xValue / this.properties.Xrange.max) * (this.properties.PointOffset * this.properties.Xrange.steps) + offsetLeft;
        ctx.lineTo(xRelValue, yRelValue);
    }
    ctx.stroke();
    ctx.closePath();
}
