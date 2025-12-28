// عناصر فرم
const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productUnit = document.getElementById("productUnit");
const productDesc = document.getElementById("productDesc");
const productMinStock = document.getElementById("productMinStock");
const productTable = document.getElementById("productTable");

let products = [];
let editIndex = -1;

// شماره سریال گروه‌ها
let groupCounters = {};  // مثال: { '001': 3, '002': 5 } 

// تولید کد کالا با پیشوند کد گروه
function generateProductCode(categoryName) {
    const group = categories.find(c => c.name === categoryName);
    if(!group) return "";

    const groupCode = group.code;

    if(!groupCounters[groupCode]) groupCounters[groupCode] = 1;
    const serial = String(groupCounters[groupCode]).padStart(6, '0');
    groupCounters[groupCode]++;

    return `${groupCode}/${serial}`;
}

// ثبت یا ویرایش کالا
productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = productName.value.trim();
    const category = productCategory.value;
    const unit = productUnit.value;
    const desc = productDesc.value.trim() || "-";
    const minStock = parseInt(productMinStock.value) || 0;

    if(!name || !category || !unit) {
        alert("لطفاً همه فیلدهای ضروری را پر کنید"); 
        return; 
    }

    if(editIndex === -1) {
        const code = generateProductCode(category);
        products.push({
            code: code,
            name: name,
            category: category,
            unit: unit,
            initialStock: minStock,
            receipt: 0,
            issue: 0,
            desc: desc
        });
    } else {
        products[editIndex].name = name;
        products[editIndex].category = category;
        products[editIndex].unit = unit;
        products[editIndex].initialStock = minStock;
        products[editIndex].desc = desc;
        editIndex = -1;
        productForm.querySelector("button").textContent = "ثبت کالا";
    }

    productForm.reset();
    productName.focus(); // <-- اینجا اضافه شد
    renderProductTable();
});


// نمایش جدول کالاها
function renderProductTable() {
    productTable.innerHTML = "";
    if(products.length === 0) {
        productTable.innerHTML = `<tr><td colspan="10" class="text-center text-muted">موردی ثبت نشده است</td></tr>`;
        return;
    }

    products.forEach((p, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.code}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.unit}</td>
            <td>${p.initialStock}</td>
            <td>${p.receipt}</td>
            <td>${p.issue}</td>
            <td>${p.initialStock + p.receipt - p.issue}</td>
            <td>${p.desc}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editProduct(${index})">ویرایش</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">حذف</button>
            </td>
        `;
        productTable.appendChild(tr);
    });
}

// حذف کالا
function deleteProduct(index) {
    const p = products[index];
    if(confirm(`آیا مطمئن هستید که کالا (${p.name}) حذف شود؟`)) {
        products.splice(index, 1);
        renderProductTable();
    }
}

// ویرایش کالا
function editProduct(index) {
    const p = products[index];
    editIndex = index;
    productName.value = p.name;
    productCategory.value = p.category;
    productUnit.value = p.unit;
    productDesc.value = p.desc;
    productMinStock.value = p.initialStock;
    productForm.querySelector("button").textContent = "ذخیره ویرایش";
}

// پر کردن dropdown گروه و واحد
function populateProductDropdowns() {
    productCategory.innerHTML = '<option value="">انتخاب گروه</option>';
    productUnit.innerHTML = '<option value="">انتخاب واحد</option>';

    categories.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.name;
        opt.textContent = c.name;
        productCategory.appendChild(opt);
    });

    units.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.name;
        opt.textContent = u.name;
        productUnit.appendChild(opt);
    });
}

// بروزرسانی dropdown وقتی گروه یا واحد جدید اضافه شد
categoryForm.addEventListener("submit", () => { setTimeout(populateProductDropdowns, 100); });
unitForm.addEventListener("submit", () => { setTimeout(populateProductDropdowns, 100); });

// نمایش اولیه جدول و dropdown ها
populateProductDropdowns();
renderProductTable();
