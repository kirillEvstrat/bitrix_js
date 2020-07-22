
let dealId = "";

BX.addCustomEvent('onPopupShow', function(arguments){

    if(arguments.params.className === "document-toolbar-menu"){
        if(!document.querySelector('.customDocument')) {
            console.log(arguments);
            let popupId = arguments.uniquePopupId;
            //console.log(popupId);
            //console.dir(popupId.toString().split("_"));
            dealId = popupId.split("_")[3];
            //console.log(dealId);
            const itemWr = document.querySelector(`#${popupId} .menu-popup-items`);
            //console.log(itemWr);
            let spanWr = document.createElement("span");
            spanWr.classList.add("menu-popup-item", "menu-popup-no-icon");
            let span = document.createElement('span');
            span.classList.add('menu-popup-item-text', "customDocument");
            span.innerText = "Счет-договор";
            spanWr.appendChild(span);
            spanWr.addEventListener("click", generateDocument);
            itemWr.prepend(spanWr);
        }
    }
});

let isBusy = false;
function generateDocument(event) {
    if (isBusy === false) {
        isBusy = true;
        BX.ajax({
            url: '/local/ajax/createDocumentInvoice.php?id=' + dealId,
            method: 'POST',
            dataType: 'json',
            data: {},
            onsuccess: function (data) {
                console.log(data);
                isBusy= false;
                alert("Документ сгенерирован и прикреплен в карточку сделки! Обновите страницу.");

            }
        });
    }
    else {
        alert("Документ уже генерируется, подождите несколько секунд!");
    }
}
