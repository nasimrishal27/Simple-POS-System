$(document).ready(function() {
    let i = 0;
    const loadCustomer = () => {
        const storedData = JSON.parse(sessionStorage.getItem("customers")) || [];
        let row = 1;
        storedData.forEach((item) => {
            $("#customerList").append(`<li>${item}</li>`);
            $("#customerdrop").append(`<option>${item}</option>`);
            
            $("#displayCustomer").append(`<tr id="row${row}">
                <th>${row}</th>
                <th>${item}</th>
                <th><button class="del" id="rowDel${row}">Delete</button>
                </tr>`);
                row++;
        });
    };

    // const deleteRow = (rowId) => {
    //     const storedData = JSON.parse(sessionStorage.getItem("customers")) || [];
    //     storedData.splice(rowId - 1, 1);
    //     saveCustomer("customers", storedData);
    // }

    $('#displayCustomer').on('click', '.del', function () {
        const id = $(this).attr('id'); 
        const index = id.replace('rowDel', ''); 
        const storedData = JSON.parse(sessionStorage.getItem("customers")) || [];
        storedData.splice(index - 1, 1);
        sessionStorage.setItem("customers", JSON.stringify(storedData));
        window.location.reload();
    });

    const loadProduct = () => {
        const storedData = JSON.parse(sessionStorage.getItem("productDetails")) || {};
        let row = 1;
        for (let key in storedData) {
            // const list = `<li>${key}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$&nbsp;&nbsp;&nbsp;${storedData[key]}</li>`;
            // $('#productList').append(list);
            $("#productDrop1").append(`<option>${key}</option>`);
            $("#displayProduct").append(`<tr id="row${row}">
                <th id="se${row}">${row}</th>
                <th id="product${row}" data-product${row}="${key}">${key}</th>
                <th id="price${row}">${storedData[key]}</th>
                <th id="but${row}"><button class="del" id="rowDel${row}">Delete</button>
                </tr>`);
                row++;
        }
    };

    $('#displayProduct').on('click', '.del', function () {
        const id = $(this).attr('id'); 
        const index = id.replace('rowDel', ''); 
        const delKey = $(`#product${index}`).attr(`data-product${index}`);
        const currentData = JSON.parse(sessionStorage.getItem("productDetails")) || {};
        delete currentData[delKey];
        sessionStorage.setItem("productDetails", JSON.stringify(currentData));
        window.location.reload();
    });

    loadCustomer();
    loadProduct();

    $('#customerForm').on('submit', function(e) {
        e.preventDefault();
        if ($('#customerBox').val() == '') {
            $('.error1').text('Add Customer Details');
        } else {
            const customer = $('#customerBox').val();
            const list = `<li>${customer}</li>`;
            saveCustomer("customers", customer);
            $('#customerList').append(list);
            $('#customerBox').val('');
            $('.error1').text('');
            window.location.reload();
        }
    });

    $('#productForm').on('submit', function(e) {
        e.preventDefault();
        if ($('#productBox').val() == '' || $('#priceBox').val() == '') {
            $('.error2').text('Add Product Details');
        } else if(!$.isNumeric($('#priceBox').val())){
            $('.error2').text('Invalid Price!');
        } else {
            const product = $('#productBox').val();
            const price = $('#priceBox').val();
            // const list = `<li>${product}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$&nbsp;&nbsp;&nbsp;${price}</li>`;
            saveProduct(product, price);
            // $('#productList').append(list);
            $('#productBox').val('');
            $('#priceBox').val('');
            $('.error2').text('');
            window.location.reload();
        }
    });


    $('#btn1').click(function() {
        // window.location.href = "http://127.0.0.1:5500/task6/order.html";
        customers = JSON.parse(sessionStorage.getItem("customers"));
        products = JSON.parse(sessionStorage.getItem("productDetails"));
        if (!customers || !products) {
            alert('Please Add Customers and Products!!');
        } else {
            window.location.href = "http://127.0.0.1:5500/task6/order.html";
        }
    });

    const saveCustomer = (storageKey, newData) => {
        const currentData = JSON.parse(sessionStorage.getItem(storageKey)) || [];
        currentData.push(newData);
        sessionStorage.setItem(storageKey, JSON.stringify(currentData));
    };

    const saveProduct = (key, value) => {
        const storageKey = "productDetails"; 
        const currentData = JSON.parse(sessionStorage.getItem(storageKey)) || {};
        currentData[key] = value; 
        sessionStorage.setItem(storageKey, JSON.stringify(currentData));
    };

    const saveCustomerData = (customerName, tableData) => {
        tableData = tableData.filter(item => item.product && item.quantity && item.unitPrice && item.subTotal);
        
        const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
        customerData[customerName] = tableData; 
        sessionStorage.setItem("customerData", JSON.stringify(customerData)); 
    };
    
    
    const fetchCustomerData = (customerName) => {
        const customerData = JSON.parse(sessionStorage.getItem("customerData")) || {};
        return customerData[customerName]?.filter(item => item.product && item.quantity && item.unitPrice && item.subTotal) || [];
    };
    
    
    let grandTotal = 0;
    // function dropValuation(index){
    //     if ($(`#productDrop${index}`).val() == "Select the product") {
    //         $("#add").hide();
    //     } else {
    //         $("#add").show();
    //         const storedData = JSON.parse(sessionStorage.getItem("productDetails"));
    //         const product = $(`#productDrop${index}`).val();
    //         $(`#unitPrice${index}`).val(storedData[product]);
    //         $(`#subTotal${index}`).val($(`#quantity${index}`).val() * storedData[product]);
    //         grandTotal += $(`#quantity${index}`).val() * storedData[product];
    //     }
    // }

    function dropValuation(index) {
        const storedData = JSON.parse(sessionStorage.getItem("productDetails"));
    
        if ($(`#productDrop${index}`).val() == "Select the product") {
            $("#add").hide();
        } else {
            $("#add").show();
            $("#saveOrder").show();
    
            const product = $(`#productDrop${index}`).val();
            const unitPrice = storedData[product];
    
            const currentSubtotal = parseFloat($(`#subTotal${index}`).val()) || 0;
    
            $(`#unitPrice${index}`).val(unitPrice);
    
            const quantity = parseFloat($(`#quantity${index}`).val()) || 1;
            const newSubtotal = quantity * unitPrice;
    
            grandTotal -= currentSubtotal; 
            grandTotal += newSubtotal; 
    
            $(`#subTotal${index}`).val(newSubtotal);
    
            $('#gt').text(`Grand Total : ${grandTotal.toFixed(2)}`);
        }
    }
    
    $('#saveOrder').click(function () {
        // const customerName = $('#customerdrop').val();
        // if (customerName == "Select a Customer ...") {
        //     alert("Please select a customer before saving!");
        //     return;
        // }
    
        // const tableData = [];
        // $('#productTable tr').each(function () {
        //     const product = $(this).find('select').val();
        //     const quantity = $(this).find('.quantity').val();
        //     const unitPrice = $(this).find('#unitPrice' + $(this).attr('id').replace('row', '')).val();
        //     const subTotal = $(this).find('#subTotal' + $(this).attr('id').replace('row', '')).val();
    
        //     if (product && product !== "Select the product") {
        //         tableData.push({ product, quantity, unitPrice, subTotal });
        //     }
        // });
    
        // if (tableData.length === 0) {
        //     alert("No products added to save!");
        //     return;
        // }
    
        // saveCustomerData(customerName, tableData);
        // alert(`Order for ${customerName} saved successfully!`);

        const customerName = $('#customerdrop').val();
        if (customerName === 'Select a Customer ...') {
            alert('Please select a customer to save data.');
            return;
        }

        const tableData = [];
        $('#productTable tr').each(function() {
            const product = $(this).find('select').val();
            const quantity = $(this).find('.quantity').val();
            const unitPrice = $(this).find('[readonly][id^=unitPrice]').val();
            const subTotal = $(this).find('[readonly][id^=subTotal]').val();

            if (product !== "Select the product") {
                tableData.push({ product, quantity, unitPrice, subTotal });
            }
        });

        saveCustomerData(customerName, tableData);
        alert(`Data saved for ${customerName}`);
    });

    $('#customerdrop').on('change', function () {

        const customerName = $(this).val();
        if (customerName == "Select a Customer ...") {
            $("#add").hide();
            $("#saveOrder").hide();
            $('#gt').hide();
            return;
        } 
        const savedData = fetchCustomerData(customerName);
        if (savedData.length == 0) {
            $("#add").hide();
            $("#saveOrder").hide();
            $('#gt').hide();
            $('#productTable').find('tr').remove();
            $('#productTable').append(`<tr>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Sub Total</th>
                            <th></th>
                        </tr>`)
            grandTotal = 0;
            return;
        } 
        if (savedData.length > 0) {
            $('#productTable').find('tr').remove();
            $('#productTable').append(`<tr>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Sub Total</th>
                            <th></th>
                        </tr>`)
            grandTotal = 0;
        
            savedData.forEach((item, index) => {
                $('#productTable').append(`<tr id="row${index + 1}">
                    <td>
                        <select id="productDrop${index + 1}">
                            <option>${item.product}</option>
                        </select>
                    </td>
                    <td>
                        <input type="number" min="1" value="${item.quantity}" id="quantity${index + 1}" class="quantity">
                    </td>
                    <td>
                        <input type="number" readonly value="${item.unitPrice}" id="unitPrice${index + 1}">
                    </td>
                    <td>
                        <input type="number" readonly value="${item.subTotal}" id="subTotal${index + 1}">
                    </td>
                    <td>
                        <button class="delete" id="btndel${index + 1}">Delete</button>
                    </td>
                </tr>`);
        
                grandTotal += parseFloat(item.subTotal);
                $('#gt').text(`Grand Total : ${grandTotal.toFixed(2)}`);
                $('#gt').show();
                $('#saveOrder').show();
            
            });
            i = savedData.length;

        } else {
            $('#productTable').show();
            $("#add").show();
        }
    });
    

    $('#productTable').on('change', 'select', function () {
        const id = $(this).attr('id');
        const index = id.replace('productDrop', ''); 
        dropValuation(index); 
    });
    

    $('#customerdrop').on('change', function() {
        if ($('#customerdrop').val() != 'Select a Customer ...') {
            $('#productTable').show();
            $("#add").show();
            // $("#saveOrder").show();
        } else {
            $('#productTable').hide();
        }
    });

    // let i = fetchCustomerData(customerName).length;
    
    $('#add').click(function() {
        $("#add").hide();
        $("#saveOrder").hide();
        $('#productTable').append(`<tr id="row${++i}">
                        <td>
                            <select id="productDrop${i}">
                                <option>Select the product</option>
                            </select>
                        </td>
                        <td>
                            <input type="number" min="1" value="1" id="quantity${i}" class="quantity">
                        </td>
                        <td>
                            <input type="number" readonly id="unitPrice${i}">
                        </td>
                        <td>
                            <input type="number" readonly id="subTotal${i}">
                        </td>
                        <td>
                            <button class="delete" id="btndel${i}">Delete</button>
                        </td>
                    </tr>`)

                    const storedData = JSON.parse(sessionStorage.getItem("productDetails"));
                    for (let key in storedData) {
                        const list = `<li>${key}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$&nbsp;&nbsp;&nbsp;${storedData[key]}</li>`;
                        $(`#productDrop${i}`).append(`<option>${key}</option>`);
                    }
                    $(`#productDrop${i}`).on('change', function() {
                        $('#gt').show();
                        dropValuation(i);
                        $('#gt').text(`Grand Total : ${grandTotal}`);
                    });
    });

    $('#productTable').on('input', '.quantity', function () {
        const id = $(this).attr('id'); 
        const index = id.replace('quantity', ''); 
        const price = $(`#unitPrice${index}`).val(); 
        const oldPrice = $(`#subTotal${index}`).val(); 
        const quantity = $(this).val(); 
        const subTotal = price * quantity; 
        $(`#subTotal${index}`).val(subTotal); 
        grandTotal -= oldPrice;
        grandTotal += subTotal;
        $('#gt').text(`Grand Total : ${grandTotal}`);
    });

    $('#productTable').on('click', '.delete', function () {
        const id = $(this).attr('id'); 
        const index = id.replace('btndel', ''); 
        const subTotal = $(`#subTotal${index}`).val();
        if ($.isNumeric( subTotal )) {
            grandTotal -= parseFloat(subTotal);
        } else {
            $("#add").show();
        }
        $('#gt').text(`Grand Total : ${grandTotal}`);
        $(`#row${index}`).remove();
        if (index == 1) {
            $("#add").show();
        }
        $('#saveOrder').show();
    });


    var $modal = $("#myModal");

    $("#saveOrder").on('click', function() {
        $modal.css("display", "block");
        const customerName = $('#customerdrop').val();
        $('#invoiceCustomer').text(`CUSTOMER : ${customerName}`)
        const savedData = fetchCustomerData(customerName);
        savedData.forEach((item, index) => {
            $('#invoiceTable').append(`<tr id="row${index + 1}">
                <td>
                    ${item.product}
                </td>
                <td>
                    ${item.quantity}
                </td>
                <td>
                    ${item.unitPrice}
                </td>
                <td>
                    ${item.subTotal}
                </td>
            </tr>`);
        });
        $('#invoiceTable').append(`<tr>
            <th>
            </th>
            <th>
            </th>
            <th>
                Grand Total
            </th>
            <th>
            ${grandTotal}
            </th>
        </tr>`);
        $('#payButton').prop('disabled', false);

    });

    const arrangeTable = () => {
        $('#invoiceTable').find('tr').remove();
            $('#invoiceTable').append(`<tr>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Sub Total</th>
                        </tr>`);
    };
    $('.close').on('click', function() {
        $modal.css('display' , "none");
        arrangeTable();
        $('#pay').text('');
    });

    $('#payButton').on('click', function() {
        $('#pay').text('Payment Successful!!!');
        $('#payButton').prop('disabled', true);
    });

    $(window).on('click', function(event) {
        if ($(event.target).is($modal)) {
            $modal.css('display' , "none");
            arrangeTable();
            $('#pay').text('');
        }
    });
});