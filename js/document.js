// عناصر فرم
const docForm = document.getElementById("documentForm");
const docType = document.getElementById("docType");
const docNumber = document.getElementById("docNumber");
const docRow = document.getElementById("docRow");
const docDate = document.getElementById("docDate");
const docPerson = document.getElementById("docPerson");
const docProduct = document.getElementById("docProduct");
const docQty = document.getElementById("docQty");
const docDesc = document.getElementById("docDesc");
const docTable = document.getElementById("documentTable");

// آرایه اسناد و متغیر ویرایش
let documents = [];
let editIndex = -1;

// شماره سند جدا برای رسید و حواله
let lastReceiptNumber = 1000;
let lastIssueNumber = 1000;

// ====== پر کردن dropdown ها ======
function populateDocDropdowns() {
    // ===== طرف حساب =====
    docPerson.innerHTML = '<option value="">انتخاب طرف حساب</option>';
    people.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.name;
        opt.textContent = p.name;
        docPerson.appendChild(opt);
    });

    // ===== کالا =====
    docProduct.innerHTML = '<option value="">انتخاب کالا</option>';
    products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.code;
        opt.textContent = p.name;
        docProduct.appendChild(opt);
    });
}

// ====== شماره سند و ردیف اتومات ======
docType.addEventListener("change", () => {
    if(docType.value === "رسید") {
        if(!lastReceiptNumber) lastReceiptNumber = 1000;
        if(!docNumber.value) docNumber.value = lastReceiptNumber + 1;
    } else if(docType.value === "حواله") {
        if(!lastIssueNumber) lastIssueNumber = 1000;
        if(!docNumber.value) docNumber.value = lastIssueNumber + 1;
    } else {
        docNumber.value = "";
    }
    // ردیف سند همیشه 1 برای سند جدید
    docRow.value = 1;
});

// ====== ثبت سند ======
docForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = docType.value;
    const number = parseInt(docNumber.value);
    const row = editIndex === -1 ? (documents.filter(d => d.number === number).length + 1) : parseInt(docRow.value);
    const date = docDate.value.trim();
    const person = docPerson.value;
    const productCode = docProduct.value;
    const qty = parseInt(docQty.value);
    const desc = docDesc.value.trim() || "-";

    if(!type || !number || !date || !person || !productCode || !qty) {
        alert("لطفاً همه فیلدهای ضروری را پر کنید"); 
        return; 
    }

    const prod = products.find(p => p.code === productCode);
    if(!prod) return;

    const totalStock = prod.initialStock + prod.receipt - prod.issue;

    // چک موجودی برای حواله
    if(type === "حواله" && qty > totalStock) {
        alert("تعداد خروج نمی‌تواند بیشتر از موجودی باشد");
        return;
    }

    if(editIndex === -1) {
        // ثبت سند جدید
        documents.push({
            type, number, row, date, person,
            productCode, productName: prod.name, unit: prod.unit,
            qty, desc
        });

        // بروزرسانی جدول کالا
        if(type === "رسید") {
            prod.receipt += qty;
            lastReceiptNumber = number;
        } else if(type === "حواله") {
            prod.issue += qty;
            lastIssueNumber = number;
        }

    } else {
        // ویرایش سند
        const doc = documents[editIndex];

        // کاهش تعداد قبلی از جدول کالا
        const oldProd = products.find(p => p.code === doc.productCode);
        if(doc.type === "رسید") oldProd.receipt -= doc.qty;
        else oldProd.issue -= doc.qty;

        // اعمال تغییرات
        doc.type = type;
        doc.number = number;
        doc.row = row;
        doc.date = date;
        doc.person = person;
        doc.productCode = productCode;
        doc.productName = prod.name;
        doc.unit = prod.unit;
        doc.qty = qty;
        doc.desc = desc;

        // اعمال دوباره در جدول کالا
        if(type === "رسید") prod.receipt += qty;
        else prod.issue += qty;

        editIndex = -1;
        docForm.querySelector("button").textContent = "ثبت سند";
    }

    docForm.reset();
    docRow.value = 1;
    setTimeout(() => { docType.focus(); }, 0);

    renderDocumentTable();
    renderProductTable(); // بروزرسانی جدول کالا
});

// ====== نمایش جدول اسناد ======
function renderDocumentTable() {
    docTable.innerHTML = "";
    if(documents.length === 0) {
        docTable.innerHTML = `<tr><td colspan="12" class="text-center text-muted">موردی ثبت نشده است</td></tr>`;
        return;
    }

    documents.forEach((d, index) => {
        const prod = products.find(p => p.code === d.productCode);
        const currentStock = prod.initialStock + prod.receipt - prod.issue;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${d.type}</td>
            <td>${d.number}</td>
            <td>${d.row}</td>
            <td>${d.date}</td>
            <td>${d.person}</td>
            <td>${d.productName}</td>
            <td>${prod.category}</td>
            <td>${prod.unit}</td>
            <td>${d.qty}</td>
            <td>${currentStock}</td>
            <td>${d.desc}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editDocument(${index})">ویرایش</button>
                <button class="btn btn-sm btn-danger" onclick="deleteDocument(${index})">حذف</button>
            </td>
        `;
        docTable.appendChild(tr);
    });
}

// ====== حذف سند ======
function deleteDocument(index) {
    const doc = documents[index];
    if(confirm(`آیا مطمئن هستید که سند ${doc.number} ردیف ${doc.row} حذف شود؟`)) {
        const prod = products.find(p => p.code === doc.productCode);
        if(doc.type === "رسید") prod.receipt -= doc.qty;
        else prod.issue -= doc.qty;

        documents.splice(index, 1);
        renderDocumentTable();
        renderProductTable();
    }
}

// ====== ویرایش سند ======
function editDocument(index) {
    const doc = documents[index];
    editIndex = index;

    docType.value = doc.type;
    docNumber.value = doc.number;
    docRow.value = doc.row;
    docDate.value = doc.date;
    docPerson.value = doc.person;
    docProduct.value = doc.productCode;
    docQty.value = doc.qty;
    docDesc.value = doc.desc;
    docForm.querySelector("button").textContent = "ذخیره ویرایش";
}
