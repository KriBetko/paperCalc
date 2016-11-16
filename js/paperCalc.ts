document.getElementById('paperCalc_eval').addEventListener('click', function () {
    calc();
});

document.getElementById('paperCalc_reset').addEventListener('click', function () {
    resetInputs();
    resetError();
});

let inputs: string[] = ["paperCalc_listH", "paperCalc_listW", "paperCalc_objH", "paperCalc_objW"];
let results: string[] = ["paperCalc_count", "paperCalc_trash"];

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
    }
}

function checkData(listW: number = 0, listH: number = 0, objW :number = 0, objH: number = 0):string
{
    if(isNaN(listH) || isNaN(listW) || isNaN(objH) || isNaN(objW))
    {
        return "Все параметры должны быть определены";
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

    for (let i = 0; i < results.length; i++)
    {
        document.getElementById(results[i]).innerText = "0";
    }
}