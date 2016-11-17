/*
 	1.生成地图，根据 mapX mapY 对应地图的每一行和每一行的第一个单元格
 	2.存储每个单元格，把每一行看做二维数组中的第一维的每一项，然后把每一行中的每个单元格看做二维数组中的第二维数组里面的每一项
 	3.创建空的二维数组容器，二维中的每一项都是undefind
 	4.创建一个数据层面的二维数组，目的就是用来做碰撞检测
 	5.设定范围scope 函数，用来限制随机物品出现的坐标x,y
 	6.随机数函数
 	7.定义蛇，并绘制出阿里
 	8.让蛇走起来，并且可以控制方向
 	9.添加物品
 	10.随机添加各种玩具
 	11.清除画布
 	12.还缺什么写什么
 * 
*/



//-------------------------------------------------
// 变量的声明部分
var mapX = 20,mapY = 20; // 定义变量用来记录一共有20行20列；

/*
  [
        [td,td,td],
        [td,td,td],
        [tr,td,td]
    ]
 
*/

var snakeDate = createArr(mapX,mapY);  // 定义数组用来存储二维数组；
//console.log(snakeDate);
var mapDate = createArr(mapX,mapY);  // 用来存储虚拟地图；

// 初始化蛇的属性
var snake = []; // [[x1,y2],[x2,y2],[x3,y3]]
var len = 3; // 长度
var speed = 10; // 速度
// 设置定时器
var snakeTimer = null;
var skateTimer = [];// 随机时间点形成的点
var breakTimer = [];
var direction = 39;

var isTab = true;
var score = document.getElementById('score');
var startGame = document.getElementById('start');


//-----------------------------------------------
// 变量初始化部分
createMap(mapX,mapY);
startGame.onclick = start;
function start() {
	this.onclick = null;
	clear();
	initSnake();
	addObj('food');
	addToy();
	walk();
};
//var p = scope();
//snakeDate[p[0],p[1]].className = "snake";
//initSnake();
//addObj('food');
//addObj('skape');
//addToy();







//------------------------------------------
//需求函数化部分
// 需求1： 创建地图
function createMap(x,y) {
	var map = document.getElementById('map');
	var table = document.createElement('table');
	table.cellPadding = table.cellSpacing = 0;
	var tbody = table.createTBody();
	for(var i = 0; i < x; i++) {
		var tr = document.createElement('tr');
		for(var j = 0; j < y; j++) {
			var td = document.createElement('td');
			snakeDate[i][j] = tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	map.appendChild(table);
}

// 需求2： 创建二维数组
function createArr(x,y) {
	var arr = new Array(x); // 创建行
	for(var i = 0; i < x; i++) {
		arr[i] = new Array(y); // 创建列
	}
	return arr;
}

// 需求3：设置范围
function scope(startX,startY,endX,endY) {
	startX = startX || 0;
	startY = startY || 0;
	endX = endX || mapX -1;  // mapX -1 是因为从0 开始，有20 个，但mapX=20;
	endY = endY || mapY -1;
	var p = [],   // 数组用来存储随机的点  
		x = rp([startX,endX]),
		y = rp([startY,endY]);
	p.push(x,y);
	//**** 用来判断这个点生成的位置是否有物品，如果有就重复执行上面的代码
	if(mapDate[x][y]) {
		return scope(startX,startY,endX,endY);
	}
	return p;
}
 
// 编写随机函数
function rp(arr) {
	var max = Math.max.apply(null,arr);
	var min = Math.min.apply(null,arr);
	return Math.round(Math.random() * (max - min) +min);
}

// 需求5： 初始化蛇
function initSnake() {
	// 找到随机点，但是这个点必须符合指定的范围，不能撞墙，也不能截取
	var p = scope(0,2,mapX - 1,parseInt(mapY/2));
	for(var i = 0; i < len; i++) {
		var x = p[0], // 某一行
			y = p[1] - i; // 某一行中的 挨着的3个td
			snake.push([x,y]);
			// 放到蛇的数组中，这样这个数组就存了3个挨着的点
			snakeDate[x][y].className = "snake"; // 绘制蛇
			mapDate[x][y] = 'snake'; // 在数组层面注册蛇的数据
	}
}

// 需求6： 让蛇走起来
//walk();
function walk() {
	clearInterval(snakeTimer);
	snakeTimer = setInterval(step,5000/speed);
}

// 控制蛇的运动
function step() {
	var headX = snake[0][0],
		headY = snake[0][1];
	switch(direction) {
		case 37:
			headY -= 1;
			break;
		case 38:
			headX -= 1;
			break;
		case 39:
			headY += 1;
			break;
		case 40:
			headX += 1;
	}
	if(headX < 0 || headX > mapX -1 || headY < 0 || headY > mapY -1 || mapDate[headX][headY] == 'snake' || mapDate[headX][headY] == 'block') {
		clearInterval(snakeTimer);
		skateTimer.forEach((item,i)=>{
			clearTimeout(item);
		})
		breakTimer.forEach((item,i)=>{
			clearTimeout(item);
		})
		alert('哈哈，你死了~');
		startGame.onclick = start;
		return;
	}
	
	if(len%4 == 0 && len < 55 && mapDate[headX][headY] == "food") {
		speed += 5;
		walk();
	}
	if(len%9 == 0 && len < 60 && mapDate[headX][headY] == 'food') {
		addObj('block');
	}
	
	if(mapDate[headX][headY] == 'skate') { // 吃了滑板，加速
		speed += 15;
		walk();
	}
	
	if(mapDate[headX][headY] == 'break') { // 吃了break，减速
		speed = 10;
		walk();
	}
	
	if(mapDate[headX][headY] == 'food') {
		addObj('food');
		mapDate[headX][headY] = true;
	}
	
	if(!mapDate[headX][headY]) {
		var lastX = snake[snake.length - 1][0];  // 数组中的最后一个中的第0个，是蛇尾的x
		var lastY = snake[snake.length - 1][1];  // 数组中的最后一个中的第1个，是蛇尾的y
		snakeDate[lastX][lastY].className = '';  // 蛇移动之后，让原来最后一位的位置的class名为空，截取最后一位
		snake.pop();
		mapDate[lastX][lastY] = false;
	}
	snake.unshift([headX,headY]); // 走的时候把蛇头新的位置添加到数组中
	snakeDate[headX][headY].className = 'snake';// 定义蛇头
	mapDate[headX][headY] = 'snake'; // 如果是蛇的位置，就不让食物显示在该点
	len = snake.length;
	score.innerHTML = (len - 3) * 10;
	isTab = true;
}

document.onkeydown = function(e) {
	var e = e || window.event; // 兼容写法（e =e ie、谷歌支持； window。event 火狐）
	if(!isTab) { // 为假停止执行
		return;
	}
	// 为方向键就让direction 的值为当前的方向键
	if(e.keyCode > 36 && e.keyCode < 41 && Math.abs(e.keyCode - direction != 2)) {
		direction = e.keyCode;
	}
	isTab = false; // 让开关为false
	return false;
}

// 需求9； 添加随机物品
function addObj(name) {
	var p = scope(); // 定义一个变量为scope
	snakeDate[p[0]][p[1]].className = name; // 定义二位数组中的某一位的class名为我们要添加的名字
	mapDate[p[0]][p[1]] = name; // 让随机出现食物的地图记录食物放在了那个位置上，那么位置就不在放置食物
}

// 需求10 ： 添加随机数量的滑板和刹车
function addToy() {
	var skateNum = rp([6,10]);
	var breakNum = rp([4,6]);
	for(var i = 0; i < skateNum; i++) {
		skateTimer.push(setTimeout(function(){
			addObj('skate');
		},rp([6000,120000])))
	}
	for(var i = 0; i < skateNum; i++) {
		breakTimer.push(setTimeout(function(){
			addObj('break');
		},rp([8000,160000])))
	}
}

//需求11: 清除地图
function clear() {
	snakeDate.forEach((item,i)=>{
		item.forEach((item,i)=>{
			item.className = "";
		})
	});
	mapDate = createArr(mapX,mapY);
	direction = 39;
	snake = [];
	len = 3;
	speed = 10;
	score.innerHTML = 0;
}
