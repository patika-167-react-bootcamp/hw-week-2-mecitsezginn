
const state = {
    userList: [],
    historyList: []
};


// ********* state *********
const setState = (stateName, newValue) => {
    state[stateName] = newValue;
    renderUserList();
}
const updateState = (custemerId, newValue) => {
    state.userList.forEach((item) => {
        if (Number(item.id) === Number(custemerId)) {
            return item.balance = Number(newValue)
        }
    });
    renderUserList();
}

const updateHistoryState = (historyId, myIsButtonActive) => {
    state.historyList.forEach((item) => {
        if (Number(item.id) === Number(historyId)) {
            return item.isButtonActive = myIsButtonActive
        }
    });
    renderHistory();
}


const setStateHistory = (stateName, newValue) => {
    state[stateName] = newValue;
    renderHistory();
}
//***************************

// ********* render *********
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

const renderHistory = () => {
    const subscribers = [
        document.getElementById("history"),
    ]
    subscribers.forEach((subscriber) => {
        subscriber.innerHTML = ""
        historyTransferList(state.historyList, subscriber)
    })
};

//***************************

// ********* add *********
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
        // historyList(myMessage);
        addHistory(0, 0, 0,myMessage,false,false,myDate())
    }

}

const addHistory = (sCustomerId, rCustomerId, sAmount, myMessage, myIsThereButton, myIsButtonActive,myDate) => {
    let historyId = 0;
    if (state.historyList.length === 0) {
        historyId = 1;
    }
    else {
        const lastIndex = state.historyList.length;
        historyId = state.historyList[lastIndex - 1].id + 1;
    }

    setStateHistory("historyList", [
        ...state.historyList,
        {
            id: historyId,
            sendingCustomerId: Number(sCustomerId),
            receivingCustomerId: Number(rCustomerId),
            amount: Number(sAmount),
            message: myMessage,
            isThereButton: myIsThereButton,
            isButtonActive: myIsButtonActive,
            date: myDate
        }
    ])
}
//***************************

// ********* remove user *********
const removeUser = (userId) => {
    let myMessage = "";
    state.userList.forEach((item, index) => {
        if (userId === item.id) {
            myMessage = state.userList[index].name + " müşterisi silindi"
            state.userList.splice(index, 1);
        }
    })

    renderUserList();

    addHistory("", "", "", myMessage,false,false,myDate())

}
//***************************

// ********* show list *********
const customerList = (list, subscriber) => {
    list.forEach((item) => {
        const newDiv = document.createElement("div");
        newDiv.setAttribute("data-id", item.id);
        newDiv.className = "d-flex justify-content-between border-bottom mt-2"
        subscriber.appendChild(newDiv);

        const newP1 = document.createElement("p");
        newP1.innerText = item.name;
        newP1.className = "m-0 p-0"
        newDiv.appendChild(newP1);

        const newP2 = document.createElement("p");
        newP2.innerText = item.balance + " ₺";
        newP2.className = "m-0 p-0 font-weight-bold"
        newDiv.appendChild(newP2);

        const button = document.createElement("button");
        button.setAttribute("data-id", item.id);
        button.innerText = "Sil";
        button.className = "btn btn-danger btn-sm mb-1";
        button.onclick = (() => {
            removeUser(item.id)
        })
        newDiv.appendChild(button);
    })
}

const sendReceiveCustomerList = (list, subscriber) => {

    list.forEach((item) => {
        if (subscriber.id === "sending-customer" && item.id === 1) {
            const sOption = document.createElement("option");
            sOption.innerText = "Gönderen Müşteri";
            subscriber.appendChild(sOption);
        }
        if (subscriber.id === "receiving-customer" && item.id === 1) {
            const rOption = document.createElement("option");
            rOption.innerText = "Alıcı Müşteri";
            subscriber.appendChild(rOption);
        }
        const newOption = document.createElement("option");
        newOption.innerText = item.name;
        newOption.value = item.id;
        subscriber.appendChild(newOption);
    });
}

const myDate = () => {
    let fullYear = new Date().toLocaleDateString();
    let fullTime = new Date().toLocaleTimeString()

    fullYear = fullYear.split(".")
    return fullYear[2] + ":" + fullYear[1] + ":" + fullYear[0] + " " + fullTime
}
const historyTransferList = (list, subscriber) => {
    list.forEach((item) => {
        const newDiv = document.createElement("div");
        newDiv.className = "d-flex border-bottom mt-2"
        subscriber.appendChild(newDiv);

        const newP1 = document.createElement("p");
        newP1.innerText = item.date  + " : ";
        newP1.className = "m-0 p-0 pr-2 font-weight-bold"
        newDiv.appendChild(newP1);

        const newP2 = document.createElement("p");
        newP2.innerText = item.message;
        newP2.className = "m-0 p-0 pr-2"
        newDiv.appendChild(newP2);

        if (item.isThereButton === true) {
            let button = document.createElement("button");
            button.innerText = "Geri Al";
            button.className = "btn btn-warning btn-sm mb-1 ml-auto";
            button.onclick = (() => {
                undoTransfer(item.id)
            })
            if(item.isButtonActive === false){
                button.disabled = true
            }
            newDiv.appendChild(button);
        }
    })
}
//***************************

// ********* transfer *********
const transfer = () => {
    const transferAmount = document.getElementById("money").value;
    const sendingCustomerId = document.getElementById("sending-customer").value;
    const receivingCustomerId = document.getElementById("receiving-customer").value;

    if (transferAmount === "" || sendingCustomerId === "Gönderen Müşteri" || receivingCustomerId === "Alıcı Müşteri") {
        alert("Müşteri bilgilerini giriniz")
    }
    else {
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
        if (Number(transferAmount) > 0) {
            if (Number(sendingCustomerInfo[0].balance) - Number(transferAmount) >= 0) {
                updateState(sendingCustomerInfo[0].id, Number(sendingCustomerInfo[0].balance) - Number(transferAmount));
                updateState(receivingCustomerInfo[0].id, Number(receivingCustomerInfo[0].balance) + Number(transferAmount));

                const myMessage = sendingCustomerInfo[0].name + " -> " + receivingCustomerInfo[0].name + " " + String(transferAmount) + " ₺ gönderdi.";
                addHistory(sendingCustomerInfo[0].id, receivingCustomerInfo[0].id, transferAmount,
                    myMessage,true,true,myDate())
                // historyTransferList(myMessage, state.historyList.length);
            }
            else {
                alert("Yetersiz bakiye")
            }
            document.getElementById("money").value = "";
        }
        else {
            alert("Transfer ücreti 0'dan büyük olmalı")
        }
    }
}

// transferi geri alır
const undoTransfer = (historyId) => {
    state.historyList.forEach((hist) => {
        if (Number(hist.id) === Number(historyId)) {

            let sendingCust = state.userList.find((user) => {
                if (Number(user.id) === hist.sendingCustomerId) {
                    return true
                }
            })
            let receivingCust = state.userList.find((user) => {
                if (Number(user.id) === hist.receivingCustomerId) {
                    return true
                }
            })

            if (sendingCust && receivingCust) {
                updateState(sendingCust.id, Number(sendingCust.balance) + Number(hist.amount));
                updateState(receivingCust.id, Number(receivingCust.balance) - Number(hist.amount));

                const myMessage = sendingCust.name + " <- " + receivingCust.name + " " + String(hist.amount) + " ₺ geri iade edildi.";
                
                addHistory(receivingCust.id, sendingCust.id, hist.amount,myMessage,false,false,myDate())
                
                updateHistoryState(historyId, false)
                
                    
            }
            else {
                alert("Kullanıcı silindiği için işlem geri alınamaz")
                updateHistoryState(historyId, false)
            }
        }
    })
    renderUserList()
}
//***************************