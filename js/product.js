// عناصر فرم
const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productUnit = document.getElementById("productUnit");
const productDesc = document.getElementById("productDesc");
const productMinStock = document.getElementById("productMinStock");
const productTable = document.getElementById("productTable");

// آرایه موقت کالاها
let products = [];

// شماره سریال گروه‌ها
let groupCounters = {};

// کمک برای تولید مخفف انگلیسی از نام گروه
function getGroupCode(groupName) {
    const words = groupName.split(/\s+/); // جدا کردن با فاصله
    let code = "";
    words.forEach(w => {
        if(w.length > 0) code += w[0].toUpperCase();
    });
    return code;
}

// تولید کد کالا خودکار
function generateProductCode(groupName) {
    const prefix = getGroupCode(groupName) + "1376/";
    if(!groupCounters[groupName]) groupCounters[groupName] = 1;
    const serial = String(groupCounters[groupName]).padStart(3, '0');
    groupCounters[groupName]++;
    return prefix + serial;
}

// نمایش جدول
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

// ثبت یا ویرایش کالا
let editIndex = -1;
productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = productName.value.trim();
    const category = productCategory.value;
    const unit = productUnit.value;
    const desc = productDesc.value.trim() || "-";
    const minStock = parseInt(productMinStock.value) || 0;

    if(!name) { alert("نام کالا را وارد کنید"); return; }
    if(!category) { alert("گروه کالا را انتخاب کنید"); return; }
    if(!unit) { alert("واحد شمارش را انتخاب کنید"); return; }

    if(editIndex === -1) {
        // ثبت جدید
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
        // ویرایش ردیف
        products[editIndex].name = name;
        products[editIndex].category = category;
        products[editIndex].unit = unit;
        products[editIndex].initialStock = minStock;
        products[editIndex].desc = desc;
        editIndex = -1;
        productForm.querySelector("button").textContent = "ثبت کالا";
    }

    productForm.reset();
    renderProductTable();
});

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

// پر کردن dropdown گروه کالا و واحد شمارش
function populateProductDropdowns() {
    const categorySelect = productCategory;
    const unitSelect = productUnit;

    categorySelect.innerHTML = '<option value="">انتخاب گروه</option>';
    unitSelect.innerHTML = '<option value="">انتخاب واحد</option>';

    categories.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.name;
        opt.textContent = c.name;
        categorySelect.appendChild(opt);
    });

    units.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.name;
        opt.textContent = u.name;
        unitSelect.appendChild(opt);
    });
}

// بروزرسانی dropdown ها وقتی گروه یا واحد جدید اضافه میشه
categoryForm.addEventListener("submit", () => { setTimeout(populateProductDropdowns, 100); });
unitForm.addEventListener("submit", () => { setTimeout(populateProductDropdowns, 100); });

// نمایش اولیه جدول
renderProductTable();
populateProductDropdowns();
