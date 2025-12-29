// ================= ELEMENTS =================
const docForm   = document.getElementById("documentForm");
const docType   = document.getElementById("docType");
const docNumber = document.getElementById("docNumber");
const docRow    = document.getElementById("docRow");
const docDate   = document.getElementById("docDate");
const docPerson = document.getElementById("docPerson");
const docProduct= document.getElementById("docProduct");
const docQty    = document.getElementById("docQty");
const docDesc   = document.getElementById("docDesc");
const docTable  = document.getElementById("documentTable");

// ================= DATA =================
let documents = [];
let docEditIndex = -1;

let lastReceiptNumber = 1000;
let lastIssueNumber   = 1000;

// ================= DROPDOWNS =================
function populateDocDropdowns() {

    // --- People ---
    docPerson.innerHTML = `<option value="">انتخاب طرف حساب</option>`;
    people.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.name;
        opt.textContent = p.name;
        docPerson.appendChild(opt);
    });

    // --- Products ---
    docProduct.innerHTML = `<option value="">انتخاب کالا</option>`;
    products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.code;
        opt.textContent = `${p.name} (${p.code})`;
        docProduct.appendChild(opt);
    });
}

// اجرای اولیه
populateDocDropdowns();

// ================= DOC TYPE =================
docType.addEventListener("change", () => {
    if (docType.value === "رسید") {
        docNumber.value = lastReceiptNumber + 1;
    } else if (docType.value === "حواله") {
        docNumber.value = lastIssueNumber + 1;
    } else {
        docNumber.value = "";
    }
    docRow.value = 1;
});

// ================= SUBMIT =================
docForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const type   = docType.value;
    const number = parseInt(docNumber.value);
    const date   = docDate.value.trim();
    const person = docPerson.value;
    const productCode = docProduct.value;
    const qty    = parseInt(docQty.value);
    const desc   = docDesc.value.trim() || "-";

    if (!type || !number || !date || !person || !productCode || !qty) {
        alert("همه فیلدهای ضروری را پر کنید");
        return;
    }

    const product = products.find(p => p.code === productCode);
    if (!product) return;

    const currentStock = product.initialStock + product.receipt - product.issue;

    if (type === "حواله" && qty > currentStock) {
        alert("موجودی کالا کافی نیست");
        return;
    }

    const row =
        docEditIndex === -1
        ? documents.filter(d => d.number === number).length + 1
        : documents[docEditIndex].row;

    // ---------- NEW ----------
    if (docEditIndex === -1) {

        documents.push({
            type,
            number,
            row,
            date,
            person,
            productCode,
            productName: product.name,
            unit: product.unit,
            qty,
            desc
        });

        if (type === "رسید") product.receipt += qty;
        else product.issue += qty;

        if (type === "رسید") lastReceiptNumber = number;
        else lastIssueNumber = number;

    }
    // ---------- EDIT ----------
    else {
        const old = documents[docEditIndex];

        if (old.type === "رسید") product.receipt -= old.qty;
        else product.issue -= old.qty;

        old.type = type;
        old.number = number;
        old.date = date;
        old.person = person;
        old.productCode = product.code;
        old.productName = product.name;
        old.unit = product.unit;
        old.qty = qty;
        old.desc = desc;

        if (type === "رسید") product.receipt += qty;
        else product.issue += qty;

        docEditIndex = -1;
        docForm.querySelector("button").textContent = "ثبت سند";
    }

    docForm.reset();
    docRow.value = 1;
    populateDocDropdowns();
    renderDocumentTable();
    renderProductTable();
});

// ================= TABLE =================
function renderDocumentTable() {
    docTable.innerHTML = "";

    if (documents.length === 0) {
        docTable.innerHTML = `
        <tr>
            <td colspan="12" class="text-center text-muted">
                موردی ثبت نشده است
            </td>
        </tr>`;
        return;
    }

    documents.forEach((d, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${d.type}</td>
            <td>${d.number}</td>
            <td>${d.row}</td>
            <td>${d.date}</td>
            <td>${d.person}</td>
            <td>${d.productName}</td>
            <td>-</td>
            <td>${d.unit}</td>
            <td>${d.qty}</td>
            <td>${d.desc}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1"
                    onclick="editDocument(${i})">ویرایش</button>
                <button class="btn btn-sm btn-danger"
                    onclick="deleteDocument(${i})">حذف</button>
            </td>
        `;
        docTable.appendChild(tr);
    });
}

// ================= DELETE =================
function deleteDocument(index) {
    const d = documents[index];
    const p = products.find(x => x.code === d.productCode);

    if (!confirm(`حذف سند ${d.number} - ردیف ${d.row} ؟`)) return;

    if (d.type === "رسید") p.receipt -= d.qty;
    else p.issue -= d.qty;

    documents.splice(index, 1);

    renderDocumentTable();
    renderProductTable();
}

// ================= EDIT =================
function editDocument(index) {
    const d = documents[index];
    docEditIndex = index;

    docType.value = d.type;
    docNumber.value = d.number;
    docRow.value = d.row;
    docDate.value = d.date;
    docPerson.value = d.person;
    docProduct.value = d.productCode;
    docQty.value = d.qty;
    docDesc.value = d.desc;

    docForm.querySelector("button").textContent = "ذخیره ویرایش";
}
