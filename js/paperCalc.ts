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
        let count = Math.round(listW/objW) * Math.round(listH/objH);
        let trash = (listArea - count * (objH*objW)) / (listArea / 100);
        showResult(count, trash);
        let n = 1;
        drawResult(listW / n, listH / n, objW / n, objH / n, count);
    }
}

function checkData(listW: number = 0, listH: number = 0, objW :number = 0, objH: number = 0):string
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
    document.getElementById("paperCalc_trash").innerText = trash.toString() + "%";
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

function calcDrawResult(listW: number, objH: number, objW: number, count: number): Array<Item> {
    let objOnRow = Math.round(listW / objW);

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

function drawResult(listW: number, listH: number, objW: number, objH: number, count: number){
    let canvas = <HTMLCanvasElement>document.getElementById("paperCalc_canvas");
    canvas.width = listW + canvasPadding;
    canvas.height = listH + canvasPadding;

    let items = calcDrawResult(listW, objH, objW, count);

    let context = canvas.getContext("2d");

    context.beginPath();
    context.fillStyle = "grey";
    context.rect(canvasPadding, canvasPadding, listW, listH);
    context.fill();
    context.stroke();

    context.fillStyle = "black";
    context.font = "20px Arial";
    let widthX = (listW / 2) + canvasPadding;
    let widthY = canvasPadding / 2;
    context.fillText(listW.toString(), widthX, widthY);

    context.save();
    context.translate(context.canvas.width - 1, 0);
    context.rotate(3 * Math.PI / 2);
    context.textAlign = "right";
    context.fillStyle = "black";
    context.font = "20px Arial";
    let heightX = (listH / 2) + canvasPadding;
    let heightY = context.canvas.width - (canvasPadding / 2);
    context.fillText(listH.toString(), -heightX, -heightY);
    context.restore();

    for (let i = 0; i < items.length; i++){
        context.beginPath();
        context.fillStyle = "white";
        context.rect(items[i].start.x, items[i].start.y, items[i].size.width, items[i].size.height);
        context.fill();
        context.stroke();

        context.fillStyle = "black";
        context.font = "30px Arial";
        context.fillText((i + 1).toString(), (items[i].start.x + (objW / 2)) - 5, (items[i].start.y + (objH / 2)) - 5);
    }
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