// عناصر فرم
const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryDesc = document.getElementById("categoryDesc");
const categoryTable = document.getElementById("categoryTable");

// آرایه موقت گروه‌ها
let categories = [];
let nextGroupCode = 1; // شماره گروه بعدی، اتومات

categoryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = categoryName.value.trim();
    const desc = categoryDesc.value.trim() || "-";

    if(!name) { alert("نام گروه کالا را وارد کنید"); return; }

    // تولید کد گروه 3 رقمی
    const code = String(nextGroupCode).padStart(3, '0');
    nextGroupCode++;

    categories.push({
        code: code,
        name: name,
        desc: desc
    });

    renderCategoryTable();
    categoryForm.reset();
});

// نمایش جدول گروه‌ها
function renderCategoryTable() {
    categoryTable.innerHTML = "";
    if(categories.length === 0) {
        categoryTable.innerHTML = `<tr><td colspan="3" class="text-center text-muted">موردی ثبت نشده است</td></tr>`;
        return;
    }

    categories.forEach((c, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.code}</td>
            <td>${c.name}</td>
            <td>${c.desc}</td>
        `;
        categoryTable.appendChild(tr);
    });
}
