var inputs = ["paperCalc_listH", "paperCalc_listW", "paperCalc_objH", "paperCalc_objW"];
var results = ["paperCalc_count", "paperCalc_trash"];
var canvasPadding = 40;
document.getElementById('paperCalc_eval').addEventListener('click', function () {
    calc();
});
document.getElementById('paperCalc_reset').addEventListener('click', function () {
    resetInputs();
    resetError();
});
function calc() {
    resetError();
    var listW = parseInt(document.getElementById("paperCalc_listW").value);
    var listH = parseInt(document.getElementById("paperCalc_listH").value);
    var objW = parseInt(document.getElementById("paperCalc_objW").value);
    var objH = parseInt(document.getElementById("paperCalc_objH").value);
    var checkResult = checkData(listW, listH, objH, objW);
    if (checkResult != null) {
        showError(checkResult);
    }
    else {
        var listArea = listH * listW;
        var count = Math.floor(listW / objW) * Math.floor(listH / objH);
        var trash = (listArea - count * (objH * objW)) / (listArea / 100);
        showResult(count, trash);
        var n = 1;
        drawResult(listW / n, listH / n, objW / n, objH / n, count);
    }
}
function checkData(listW, listH, objW, objH) {
    if (isNaN(listH) || isNaN(listW) || isNaN(objH) || isNaN(objW)) {
        return "Все поля должны быть заполнены";
    }
    else if (listH <= 0 || listW <= 0 || objH <= 0 || objW <= 0) {
        return "Все параметры должны быть больше 1";
    }
    else if (objH * objW > listH * listW) {
        return "Площадь листа не должна быть меньше площади требуемого формата";
    }
    else {
        return null;
    }
}
function showResult(count, trash) {
    document.getElementById("paperCalc_count").innerText = count.toString() + " шт.";
    document.getElementById("paperCalc_trash").innerText = trash.toFixed(2) + "%";
}
function showError(message) {
    document.getElementById("paperCalc_error").style.display = "block";
    document.getElementById("paperCalc_error").innerText = message;
}
function resetError() {
    document.getElementById("paperCalc_error").style.display = "none";
    document.getElementById("paperCalc_error").innerText = "";
}
function resetInputs() {
    for (var i = 0; i < inputs.length; i++) {
        document.getElementById(inputs[i]).value = "";
    }
    for (var j = 0; j < results.length; j++) {
        document.getElementById(results[j]).innerText = "0";
    }
}
function drawResult(listW, listH, objW, objH, count) {
    var image = document.getElementById('paperCalc_image');
    var canvas = document.createElement('canvas');
    image.width = image.parentElement.offsetWidth;
    canvas.width = image.parentElement.offsetWidth;
    var scale = (image.width - canvasPadding) / listW;
    image.height = (listH + canvasPadding) * scale;
    canvas.height = (listH + canvasPadding) * scale;
    var objOnRow = Math.floor(listW / objW);
    var textListWidth = listW.toString();
    var textListHeight = listH.toString();
    listW = listW * scale;
    listH = listH * scale;
    objW = objW * scale;
    objH = objH * scale;
    var items = calcDrawResult(objH, objW, count, objOnRow);
    var context = canvas.getContext("2d");
    context.beginPath();
    context.fillStyle = "grey";
    context.rect(canvasPadding, canvasPadding, listW, listH);
    context.fill();
    context.stroke();
    context.fillStyle = "black";
    context.font = 20 + "px Arial";
    context.fillText(textListWidth, (listW / 2) + canvasPadding, canvasPadding / 2);
    context.save();
    context.translate(context.canvas.width - 1, 0);
    context.rotate(3 * Math.PI / 2);
    context.textAlign = "right";
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText(textListHeight, -((listH / 2) + canvasPadding), -(context.canvas.width - (canvasPadding / 2)));
    context.restore();
    for (var i = 0; i < items.length; i++) {
        context.beginPath();
        context.fillStyle = "white";
        context.rect(items[i].start.x, items[i].start.y, items[i].size.width, items[i].size.height);
        context.fill();
        context.stroke();
        context.fillStyle = "black";
        var fontWidth = objW < 100 ? Math.floor(objW / 2) : Math.floor(objW / 4);
        context.font = fontWidth + "px Arial";
        context.fillText((i + 1).toString(), items[i].start.x + 2, items[i].start.y + fontWidth);
    }
    image.src = canvas.toDataURL();
    parent.postMessage("resize", "*");
}
function calcDrawResult(objH, objW, count, objOnRow) {
    var items = [];
    for (var i = 1; i <= count; i++) {
        var item = new Item();
        item.index = i;
        item.calcItemPosition(i, objOnRow);
        item.calcItemSize(objW, objH);
        item.calcItemCoordinates();
        items.push(item);
    }
    return items;
}
var Item = (function () {
    function Item() {
    }
    Item.prototype.calcItemPosition = function (index, objOnRow) {
        var x = 0;
        var y = 0;
        var cache = index % objOnRow;
        if (cache == 0) {
            x = objOnRow;
            y = index / objOnRow;
        }
        else {
            x = cache;
            y = (index + (objOnRow - cache)) / objOnRow;
        }
        this.position = new ItemPosition(x, y);
    };
    Item.prototype.calcItemCoordinates = function () {
        this.start = new ItemPosition((this.size.width * (this.position.x - 1)) + canvasPadding, (this.size.height * (this.position.y - 1)) + canvasPadding);
    };
    Item.prototype.calcItemSize = function (objW, objH) {
        this.size = new ItemSize(objW, objH);
    };
    return Item;
}());
var ItemPosition = (function () {
    function ItemPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    ItemPosition.prototype.get = function () {
        return { x: this.x, y: this.y };
    };
    return ItemPosition;
}());
var ItemSize = (function () {
    function ItemSize(width, height) {
        this.width = width;
        this.height = height;
    }
    ItemSize.prototype.get = function () {
        return { width: this.width, height: this.height };
    };
    return ItemSize;
}());
document.getElementById('paperCalc_test').addEventListener('click', function () {
    test();
});
function test() {
    var tests = [
        [787, 1092, 210, 300],
        [787, 1092, 300, 300],
        [710, 1010, 340, 450],
        [700, 1000, 200, 200],
        [700, 1000, 50, 90]
    ];
    function getRandomTest() {
        var randArr = tests[Math.floor((Math.random() * tests.length - 1))];
        var reverse = Math.floor(Math.random() * 2 + 1);
        if (reverse == 2) {
            var tmp = randArr[1];
            randArr[1] = randArr[0];
            randArr[0] = tmp;
            tmp = randArr[3];
            randArr[3] = randArr[2];
            randArr[2] = tmp;
        }
        return { listW: randArr[0], listH: randArr[1], objW: randArr[2], objH: randArr[3] };
    }
    var params = getRandomTest();
    document.getElementById("paperCalc_listW").value = params.listW.toString();
    document.getElementById("paperCalc_listH").value = params.listH.toString();
    document.getElementById("paperCalc_objW").value = params.objW.toString();
    document.getElementById("paperCalc_objH").value = params.objH.toString();
    document.getElementById("paperCalc_eval").click();
}
//# sourceMappingURL=paperCalc.js.map