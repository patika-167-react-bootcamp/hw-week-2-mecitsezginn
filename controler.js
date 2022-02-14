
const state = {
    userList: [],
};

const setState = (stateName, newValue) => {
    state[stateName] = newValue;
    renderUserList();
}
const updateState = (custemerId,newValue) => {
    state.userList.forEach((item) =>{
        if(Number(item.id) === Number(custemerId)){
            return item.balance = Number(newValue)
        }
    });
    renderUserList();
}

const renderUserList = () => {
    const subscribers1 = [
        document.getElementById("customers")
    ]
    const subscribers2 = [
        document.getElementById("sending-customer"),
        document.getElementById("receiving-customer")
    ]
    subscribers1.forEach((subscriber) => {
        subscriber.innerHTML = ""
        customerList(state.userList, subscriber)
    })
    subscribers2.forEach((subscriber) => {
        subscriber.innerHTML = ""
        sendReceiveCustomerList(state.userList, subscriber)
    })
}

const addUser = () => {
    const userName = document.getElementById("userName").value;
    const userBalance = document.getElementById("userBalance").value;
    const userId = state.userList.length + 1;
    if (userName === "" || userBalance === "") {
        alert("Müşteri bilgilerini giriniz")
    }
    else {
        setState("userList", [
            ...state.userList,
            {
                name: userName,
                id: userId,
                balance: Number(userBalance)
            }
        ])

        document.getElementById("userName").value = "";
        document.getElementById("userBalance").value = "";
        // console.log(userName, userBalance, state.userList)

        const myMessage = userName + " müşterisi eklendi";
        history(myMessage);
    }
    
}

const customerList = (list, subscriber) => {
    list.forEach((item) => {
        const newDiv = document.createElement("div");
        newDiv.setAttribute("data-id", item.id);
        newDiv.className = "d-flex justify-content-around border-bottom mt-2"
        subscriber.appendChild(newDiv);

        const newP1 = document.createElement("p");
        newP1.innerText = item.name ;
        newP1.className = "m-0 p-0"
        newDiv.appendChild(newP1);

        const newP2 = document.createElement("p");
        newP2.innerText = item.balance + " TL";
        newP2.className = "m-0 p-0 font-weight-bold"
        newDiv.appendChild(newP2);
    })
}

const sendReceiveCustomerList = (list, subscriber) =>{

    list.forEach((item) => {
        if(subscriber.id === "sending-customer" && item.id === 1){
            const sOption= document.createElement("option");
            sOption.innerText = "Gönderen Müşteri";
            subscriber.appendChild(sOption);
        }
        if(subscriber.id === "receiving-customer" && item.id === 1){
            const rOption= document.createElement("option");
            rOption.innerText = "Alıcı Müşteri";
            subscriber.appendChild(rOption);
        }
        const newOption= document.createElement("option");
        newOption.innerText = item.name;
        newOption.value = item.id;
        subscriber.appendChild(newOption);
    });
}

const transfer = () => {
    const transferAmount  = document.getElementById("money").value;
    const sendingCustomerId = document.getElementById("sending-customer").value;
    const receivingCustomerId = document.getElementById("receiving-customer").value;

    if(transferAmount === "" || sendingCustomerId === "Gönderen Müşteri" || receivingCustomerId === "Alıcı Müşteri"){
        alert("Müşteri bilgilerini giriniz")
    }
    else{
        var sendingCustomerInfo = state.userList.filter((item) => {
            if (Number(item.id) === Number(sendingCustomerId)) {
                return true;
            }
        })

        var receivingCustomerInfo = state.userList.filter((item) => {
            if (Number(item.id) === Number(receivingCustomerId)) {
                return true;
            }
        })

        if(Number(sendingCustomerInfo[0].balance) - Number(transferAmount) >= 0){
            updateState(sendingCustomerInfo[0].id, Number(sendingCustomerInfo[0].balance) - Number(transferAmount));
            updateState(receivingCustomerInfo[0].id, Number(receivingCustomerInfo[0].balance) + Number(transferAmount));

            const myMessage = sendingCustomerInfo[0].name + " -> " + receivingCustomerInfo[0].name +" "+ String(transferAmount) + " TL gönderdi.";
            history(myMessage);
        }
        else{
            alert("Yetersiz bakiye")
        }

        document.getElementById("money").value = "";
    }
}

const myDate = () =>{
    let fullYear = new Date().toLocaleDateString();
    let fullTime = new Date().toLocaleTimeString()

    fullYear = fullYear.split(".")
    return fullYear[2]+":"+fullYear[1]+":"+fullYear[0]+" "+fullTime
}
const history = (message) =>{
    
    const his = document.getElementById("history");
    const newDiv = document.createElement("div");
    newDiv.className = "d-flex border-bottom mt-2"
    his.appendChild(newDiv);

    const newP1 = document.createElement("p");
    newP1.innerText =  myDate() + " : ";
    newP1.className = "m-0 p-0 pr-2 font-weight-bold"
    newDiv.appendChild(newP1);

    const newP2 = document.createElement("p");
    newP2.innerText = message;
    newP2.className = "m-0 p-0 pr-2"
    newDiv.appendChild(newP2); 
}