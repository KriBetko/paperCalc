document.getElementById('paperCalc_eval').addEventListener('click', function () {
    calc();
});

document.getElementById('paperCalc_reset').addEventListener('click', function () {
    resetInputs();
});

function calc()
{
    let listW = parseInt((<HTMLInputElement>document.getElementById("paperCalc_listW")).value);
    let listH = parseInt((<HTMLInputElement>document.getElementById("paperCalc_listH")).value);
    let objW = parseInt((<HTMLInputElement>document.getElementById("paperCalc_objW")).value);
    let objH = parseInt((<HTMLInputElement>document.getElementById("paperCalc_objH")).value);


    var checkResult = checkData(listW, listH, objH, objW);
    if(checkResult != null)
    {
        showError(checkResult);
    }
    else
    {
        let listArea = listH*listW;
        let objArea = objH*objW;
        var count = listArea/objArea;
        var trash = 0;

        if(!isInt(count))
        {
            count = Math.floor(count);
            let totalObjArea = count * objArea - listArea;
            trash = Math.abs(totalObjArea / (listArea / 100));
        }

        showResult(count, trash, 0);
    }
}

function checkData(listW: number = 0, listH: number = 0, objW :number = 0, objH: number = 0):string
{
    if(listH <= 0 || listW <= 0 || objH <= 0 || objW <= 0)
    {
        return "Все параметри должны быть больше 1";
    }
    else if(objH*objW > listH*listW)
    {
        return "Площадь листа не должна быть меньше площади требуемого формата";
    }

    return null;
}

function showResult(count: number, trash: number, gap: number)
{
    document.getElementById("paperCalc_count").innerText = count.toString();
    document.getElementById("paperCalc_trash").innerText = trash.toString() + "%";
    document.getElementById("paperCalc_gap").innerText = gap.toString();
}

function showError(message: string)
{
    document.getElementById("paperCalc_error").innerText = message;
}

function resetInputs()
{
    let inputs: string[] = ["paperCalc_listH", "paperCalc_listW", "paperCalc_objH", "paperCalc_objW"];
    for (var i = 0; i < inputs.length; i++)
    {
        (<HTMLInputElement>document.getElementById(inputs[i])).value = "0";
    }

    let results: string[] = ["paperCalc_count", "paperCalc_trash", "paperCalc_gap"];
    for (i = 0; i < results.length; i++)
    {
        document.getElementById(results[i]).innerText = "0";
    }
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}