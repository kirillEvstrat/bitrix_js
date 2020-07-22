BX.ready(
    function () {
        const allQuaInpArr = document.querySelectorAll('.crm-item-qua .crm-item-table-inp');
        const totalQuaField = document.querySelector("#deal_product_editor_qua_total");
        console.log(allQuaInpArr);
        const productQuaArr = [];
        allQuaInpArr.forEach(function (el, key) {
            productQuaArr[el.id] = el.value;
            el.addEventListener('change', function(e){
                onChange(e, productQuaArr, totalQuaField);
            });
        });
        //console.log(productQuaArr);

        BX.addCustomEvent('productAdd', function (el) {
            console.log(el);

            const newQuaInp = el.product._dragButton.closest('.crm-item-name').parentNode.querySelector('.crm-item-qua .crm-item-table-inp');
            //console.log(newQuaInp);
            productQuaArr[newQuaInp.id] = 1;
            const  totalQua = Number(totalQuaField.innerHTML);
            //console.log(totalQua);
            totalQuaField.innerHTML = totalQua + 1;
            newQuaInp.addEventListener('change', function(e){
                onChange(e, productQuaArr, totalQuaField);
            });


            addArticleInfo(el);
        });
    }
);

function onChange(e, productQuaArr, totalQuaField) {
    const inpID = e.target.id;
    let value = e.target.value;
    console.log(value);
    let difference = 0;

    if(productQuaArr[inpID] !== undefined){
        difference = value  - productQuaArr[inpID];
        productQuaArr[inpID] = value;
    }
    else{
        difference = value;
        productQuaArr[inpID] = value;
    }
    console.log(difference);
    const  totalQua = Number(totalQuaField.innerHTML);
    //console.log(totalQua);
    totalQuaField.innerHTML = totalQua + difference;
}

function addArticleInfo(el) {
    const productID = el.product._settings.PRODUCT_ID;
    console.log(productID);
    BX.ajax({
        'url': '/local/ajax/getProductArticle.php',
        'method': 'POST',
        'dataType': 'json',
        'data':
            {
                "ID": productID,
            },
        onsuccess: function (res) {
            console.log(res);
            const articleWr = el.product._dragButton.closest('.crm-item-name').parentNode.querySelector('.crm-item-price');
            console.log(articleWr);
            articleWr.innerHTML +="<span style='margin-top: 5px;' class='crm-item-cell-text'><input readonly id="+productID+"'_ARTICLE' type='text' class='crm-item-table-inp' value='"+ res + "'></span>";
        },
    });

}
