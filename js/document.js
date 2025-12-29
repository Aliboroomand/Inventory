// عناصر فرم
const docForm = document.getElementById("docForm");
const docType = document.getElementById("docType");
const docNumber = document.getElementById("docNumber");
const docRow = document.getElementById("docRow");
const docDate = document.getElementById("docDate");
const docPerson = document.getElementById("docPerson");
const docCategory = document.getElementById("docCategory");
const docProduct = document.getElementById("docProduct");
const docQty = document.getElementById("docQty");
const docDesc = document.getElementById("docDesc");
const docTable = document.getElementById("docTable");

// آرایه‌ها
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
        let name = "";

        if (p.type === "حقیقی") {
            name = `${p.firstName} ${p.lastName}`;
        } else {
            name = p.companyName;
        }

        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
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


// شماره سند و ردیف سند اتومات
docType.addEventListener("change", () => {
    if(docType.value === "رسید") {
        docNumber.value = lastReceiptNumber + 1;
    } else if(docType.value === "حواله") {
        docNumber.value = lastIssueNumber + 1;
    } else {
        docNumber.value = "";
    }
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
    const category = docCategory.value;
    const productCode = docProduct.value;
    const qty = parseInt(docQty.value);
    const desc = docDesc.value.trim() || "-";

    if(!type || !number || !date || !person || !category || !productCode || !qty) {
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

    // ثبت یا ویرایش
    if(editIndex === -1) {
        documents.push({
            type, number, row, date, person, category,
            productCode, productName: prod.name, unit: prod.unit,
            qty, desc
        });

        // بروزرسانی جدول کالا
        if(type === "رسید") prod.receipt += qty;
        else if(type === "حواله") prod.issue += qty;

        // بروزرسانی شماره سند
        if(type === "رسید") lastReceiptNumber = number;
        else lastIssueNumber = number;

    } else {
        const doc = documents[editIndex];
        // کاهش تعداد قبلی از جدول کالا
        if(doc.type === "رسید") prod.receipt -= doc.qty;
        else prod.issue -= doc.qty;

        doc.type = type;
        doc.number = number;
        doc.row = row;
        doc.date = date;
        doc.person = person;
        doc.category = category;
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
    docNumber.value = (type === "رسید" ? lastReceiptNumber + 1 : lastIssueNumber + 1);
    docRow.value = 1;
    setTimeout(() => { docType.focus(); }, 0);

    renderDocumentTable();
    renderProductTable(); // جدول کالا رو هم آپدیت می‌کنیم
});

// ====== نمایش جدول اسناد ======
function renderDocumentTable() {
    docTable.innerHTML = "";
    if(documents.length === 0) {
        docTable.innerHTML = `<tr><td colspan="12" class="text-center text-muted">موردی ثبت نشده است</td></tr>`;
        return;
    }

    documents.forEach((d, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${d.type}</td>
            <td>${d.number}</td>
            <td>${d.row}</td>
            <td>${d.date}</td>
            <td>${d.person}</td>
            <td>${d.productName}</td>
            <td>${d.category}</td>
            <td>${d.unit}</td>
            <td>${d.qty}</td>
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
        renderProductTable(); // جدول کالا هم آپدیت شود
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
    docCategory.value = doc.category;

    // وقتی گروه انتخاب شد، کالای مربوطه را انتخاب کن
    docCategory.dispatchEvent(new Event("change"));
    docProduct.value = doc.productCode;

    docQty.value = doc.qty;
    docDesc.value = doc.desc;
    docForm.querySelector("button").textContent = "ذخیره ویرایش";
}
