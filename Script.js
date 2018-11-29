window.onload = function() {

	var dataPoints = [];

var chart = new CanvasJS.Chart("chartContainer", {
	theme: "light2",
	title: {
		text: "Live Data"
	},
	data: [{
		type: "line",
		dataPoints: dataPoints
	}]
});
updateData();

// Initial Values
var xValue = 0;
var yValue = 0;
var newDataCount = 6;

function addData(data) {

	if(newDataCount != 1) {
		$.each(data, function(key, value) {
			dataPoints.push({x: value[0], y: parseInt(value[1])});
			xValue++;
			yValue = parseInt(value[1]);
		});
	} else {
		//dataPoints.shift();
		dataPoints.push({x: xValue, y: parseInt(data[0][1])});
		xValue++;
		yValue = parseInt(data[0][1]);
	}

	newDataCount = 1;
	chart.render();
	setTimeout(updateData, 1500);
}

function updateData() {
	//addData([[0, 1], [1, 2], [2, 3]]);
  fetch('http://172.22.33.224:3000/catch')
  .then((res) => {
    //console.log(res);
    return res.json()
  }).then((data) => {

		const mappedData = data.map((element, index)=>{
			return [index, element.speed]
		});
		document.getElementById('speed-value').innerHTML = data [data.length-1].speed
    addData(mappedData)

  });
};
};
