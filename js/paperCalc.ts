const inputs: string[] = ["paperCalc_listH", "paperCalc_listW", "paperCalc_objH", "paperCalc_objW"];
const results: string[] = ["paperCalc_count", "paperCalc_trash"];
const canvasPadding = 40;

document.getElementById('paperCalc_eval').addEventListener('click', function () {
    calc();
});

document.getElementById('paperCalc_reset').addEventListener('click', function () {
    resetInputs();
    resetError();
});

function calc()
{
    resetError();
    let listW = parseInt((<HTMLInputElement>document.getElementById("paperCalc_listW")).value);
    let listH = parseInt((<HTMLInputElement>document.getElementById("paperCalc_listH")).value);
    let objW = parseInt((<HTMLInputElement>document.getElementById("paperCalc_objW")).value);
    let objH = parseInt((<HTMLInputElement>document.getElementById("paperCalc_objH")).value);

    let checkResult = checkData(listW, listH, objH, objW);
    if(checkResult != null)
    {
        showError(checkResult);
    }
    else
    {
        let listArea = listH*listW;
        let count = Math.floor(listW/objW) * Math.floor(listH/objH);
        let trash = (listArea - count * (objH*objW)) / (listArea / 100);
        showResult(count, trash);
        let n = 1;
        drawResult(listW / n, listH / n, objW / n, objH / n, count);
    }
}

function checkData(listW: number, listH: number, objW :number, objH: number):string
{
    if(isNaN(listH) || isNaN(listW) || isNaN(objH) || isNaN(objW))
    {
        return "Все поля должны быть заполнены";
    }
    else if(listH <= 0 || listW <= 0 || objH <= 0 || objW <= 0)
    {
        return "Все параметры должны быть больше 1";
    }
    else if(objH*objW > listH*listW)
    {
        return "Площадь листа не должна быть меньше площади требуемого формата";
    }
    else
    {
        return null;
    }
}

function showResult(count: number, trash: number)
{
    document.getElementById("paperCalc_count").innerText = count.toString() + " шт.";
    document.getElementById("paperCalc_trash").innerText = trash.toFixed(2) + "%";
}

function showError(message: string)
{
    document.getElementById("paperCalc_error").style.display = "block";
    document.getElementById("paperCalc_error").innerText = message;
}

function resetError()
{
    document.getElementById("paperCalc_error").style.display = "none";
    document.getElementById("paperCalc_error").innerText = "";
}

function resetInputs()
{
    for (let i = 0; i < inputs.length; i++)
    {
        (<HTMLInputElement>document.getElementById(inputs[i])).value = "";
    }

    for (let j = 0; j < results.length; j++)
    {
        document.getElementById(results[j]).innerText = "0";
    }
}

function drawResult(listW: number, listH: number, objW: number, objH: number, count: number){
    let canvas = <HTMLCanvasElement>document.getElementById("paperCalc_canvas");
    canvas.width = canvas.parentElement.offsetWidth;
    let scale = (canvas.width - canvasPadding) / listW;
    canvas.height = (listH + canvasPadding) * scale;

    let objOnRow = Math.floor(listW / objW);

    let textListWidth = listW.toString();
    let textListHeight = listH.toString();
    listW = listW * scale;
    listH = listH * scale;
    objW = objW * scale;
    objH = objH * scale;

    let items = calcDrawResult(listW, objH, objW, count, objOnRow);

    let context = canvas.getContext("2d");

    context.beginPath();
    context.fillStyle = "grey";
    context.rect(canvasPadding, canvasPadding, listW, listH);
    context.fill();
    context.stroke();

    context.fillStyle = "black";
    context.font =  20 + "px Arial";
    context.fillText(textListWidth,
        (listW / 2) + canvasPadding,
        canvasPadding / 2
    );

    context.save();
    context.translate(context.canvas.width - 1, 0);
    context.rotate(3 * Math.PI / 2);
    context.textAlign = "right";
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText(textListHeight,
        -((listH / 2) + canvasPadding),
        -(context.canvas.width - (canvasPadding / 2))
    );
    context.restore();

    for (let i = 0; i < items.length; i++){
        context.beginPath();
        context.fillStyle = "white";
        context.rect(items[i].start.x, items[i].start.y, items[i].size.width, items[i].size.height);
        context.fill();
        context.stroke();

        context.fillStyle = "black";
        let fontWidth = objW < 100 ? Math.floor(objW / 2) : Math.floor(objW / 4);
        context.font = fontWidth + "px Arial";
        context.fillText((i + 1).toString(), items[i].start.x + 2, items[i].start.y + fontWidth);
    }

    parent.postMessage("resize", "*");
}

function calcDrawResult(listW: number, objH: number, objW: number, count: number, objOnRow: number): Array<Item> {
    let items: Array<Item> = [];

    for (let i = 1; i <= count; i++){
        let item = new Item();
        item.index = i;
        item.calcItemPosition(i, objOnRow);
        item.calcItemSize(objW, objH);
        item.calcItemCoordinates();
        items.push(item);
    }

    return items;
}

class Item{
    index: number;
    position: ItemPosition;
    start: ItemPosition;
    size: ItemSize;

    calcItemPosition(index: number, objOnRow: number){
        let x = 0;
        let y = 0;

        let cache = index % objOnRow;
        if(cache == 0) {
            x = objOnRow;
            y = index / objOnRow;
        }
        else {
            x = cache;
            y = (index + (objOnRow - cache)) / objOnRow;
        }

        this.position = new ItemPosition(x, y);
    }

    calcItemCoordinates(){
        this.start = new ItemPosition(
            (this.size.width * (this.position.x - 1)) + canvasPadding,
            (this.size.height * (this.position.y - 1)) + canvasPadding
        );
    }

    calcItemSize(objW: number, objH: number){
        this.size = new ItemSize(objW, objH);
    }
}

class ItemPosition{
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    get():{x: number, y: number}{
        return {x: this.x, y: this.y};
    }
}

class ItemSize{
    width: number;
    height: number;

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
    }

    get():{width: number, height: number}{
        return {width: this.width, height: this.height};
    }
}

document.getElementById('paperCalc_test').addEventListener('click', function () {
    test();
});

function test(){
    const tests =
    [
        [787, 1092, 210, 300],
        [787, 1092, 300, 300],
        [710, 1010, 340, 450],
        [700, 1000, 200, 200],
        [700, 1000, 50, 90]
    ];

    function getRandomTest():{listW: number, listH: number, objW: number, objH:number} {
        let randArr = tests[Math.floor((Math.random() * tests.length - 1))];

        let reverse = Math.floor(Math.random() * 2 + 1);
        if(reverse == 2){
            let tmp = randArr[1];
            randArr[1] = randArr[0];
            randArr[0] = tmp;
            tmp = randArr[3];
            randArr[3] = randArr[2];
            randArr[2] = tmp;
        }

        return {listW: randArr[0], listH: randArr[1], objW: randArr[2], objH: randArr[3]};
    }

    let params = getRandomTest();

    (<HTMLInputElement>document.getElementById("paperCalc_listW")).value = params.listW.toString();
    (<HTMLInputElement>document.getElementById("paperCalc_listH")).value = params.listH.toString();
    (<HTMLInputElement>document.getElementById("paperCalc_objW")).value = params.objW.toString();
    (<HTMLInputElement>document.getElementById("paperCalc_objH")).value = params.objH.toString();

    (<HTMLButtonElement>document.getElementById("paperCalc_eval")).click();
}