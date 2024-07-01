let section = document.querySelector("section");

// 針對按鈕做設定，移除表單功能
let add = document.querySelector("form button");
add.addEventListener("click", e => {
    e.preventDefault();

    //parentElment抓取父層的form
    // console.log(e.target.parentElment);

    let form = e.target.parentElement;
    //抓取前面四個input的資料
    // console.log(form.children);
    let todoText = form.children[0].value;
    let todoY = form.children[1].value;
    let todoM = form.children[2].value;
    let todoD = form.children[3].value;
    // console.log(todoText,todoY,todoM,todoD);

    //取得資料後需驗證是否為空值
    if (todoText === "") {
        alert("請輸入事項");
        return;
    } else {

        if (todoY === "" || todoM === "" || todoD === "") {
            alert("日期不完整，請重新輸入");
            return;
        } else {
            // let numtodoY = Number(todoY);
            // let numtodoM = Number(todoM);
            // let numtodoD = Number(todoD);
            // if ((numtodoY < 2000 || numtodoY > 2050) || (numtodoM < 1 || numtodoM > 12) || (numtodoD < 1 || numtodoD > 31)) {
            //     alert("日期輸入錯誤");
            //     return;
            // }
            if ((todoY < 2000 || todoY > 2050) || (todoM < 1 || todoM > 12) || (todoD < 1 || todoD > 31)) {
                alert("日期輸入錯誤");
                return;
            }
        }
    }

    //新增div 類別為todo
    let todo = document.createElement("div");
    todo.classList.add("todo");

    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;

    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoY + "/" + todoM + "/" + todoD;

    todo.appendChild(text);
    todo.appendChild(time);

    //新增完成按鈕
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

    //完成後執行畫線與淡化
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        console.log(todoItem);
        todoItem.classList.toggle("done");
        //toggle可避免誤觸再改回原始狀態
    });

    //刪除按鈕
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    //刪除按鈕的動畫與移除
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        //動畫結束在執行的監聽
        todoItem.addEventListener("animationend", () => {
            //刪除localstorage內資料
            let text = todoItem.children[0].innerText;//取得同一行的資料
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            });
            todoItem.remove();
        });
        //消失動畫
        todoItem.style.animation = "scaleDown 0.5s forwards";

    });

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUP 0.3s forwards";

    let myTodo = {
        todoText: todoText,
        todoY: todoY,
        todoM: todoM,
        todoD: todoD
    };
    //物件改成字串放入陣列
    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        //myListArray本身已經是陣列嘞不需要+中括號
        localStorage.setItem("list", JSON.stringify(myListArray));
        console.log("myListArray");
    }

    //前方動作做完後顯示前要清空格子
    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";
    form.children[3].value = "";

    section.appendChild(todo);
    // console.log(todo);
});

loadData();
function loadData() {
    //讀取內部資料格式
    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {

            //抓取前面的程式碼，資料來源為item取得
            let todo = document.createElement("div");
            todo.classList.add("todo");

            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;

            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoY + "/" + item.todoM + "/" + item.todoD;

            todo.appendChild(text);
            todo.appendChild(time);

            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

            completeButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                console.log(todoItem);
                todoItem.classList.toggle("done");
            });

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

            trashButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.addEventListener("animationend", () => {
                    //刪除localstorage內資料
                    let text = todoItem.children[0].innerText;//取得同一行的資料
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach((item, index) => {
                        if (item.todoText == text) {
                            myListArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(myListArray));
                        }
                    });

                    todoItem.remove();
                });
                todoItem.style.animation = "scaleDown 0.5s forwards";
                section.appendChild(todo);

            });
            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            todo.style.animation = "scaleUP 0.3s forwards";

            section.appendChild(todo);
        });
    }
}


//比較
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0, j = 0;
    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoY) > Number(arr2[j].todoY)) {
            result.push(arr2[j]); //j較小先回傳第一個位置
            j++;
        } else if (Number(arr1[i].todoY) < Number(arr2[j].todoY)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoY) == Number(arr2[j].todoY)) {
            if (Number(arr1[i].todoM) > Number(arr2[j].todoM)) {
                result.push(arr2[j]);
                j++;
            } else if (Number(arr1[i].todoM) < Number(arr2[j].todoM)) {
                result.push(arr1[i]);
                i++;
            } else if (Number(arr1[i].todoM) == Number(arr2[j].todoM)) {
                if (Number(arr1[i].todoD) > Number(arr2[j].todoD)) {
                    result.push(arr2[j]);
                    j++;
                }
                else {
                    result.push(arr1[i]);
                    i++;
                }
            }
        }
    }
    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }
    return result;
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let left = arr.slice(0, middle);
        let right = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

let sortButton=document.querySelector("div.sort button");
sortButton.addEventListener("click",()=>{
    let sortedArray=mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list",JSON.stringify(sortedArray));

    let len=section.children.length;
    for(let i=0;i<len;i++){
        section.children[0].remove();
    }
    loadData();
}) 