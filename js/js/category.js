// عناصر فرم
const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryDesc = document.getElementById("categoryDesc");
const categoryTable = document.getElementById("categoryTable");

// آرایه موقت برای نمایش جدول
let categories = [];

// ثبت گروه کالا
categoryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = categoryName.value.trim();
    if (!name) { alert("نام گروه کالا را وارد کنید"); return; }

    categories.push({
        name: name,
        desc: categoryDesc.value.trim() || "-"
    });

    categoryForm.reset();
    renderCategoryTable();
});

// نمایش جدول
function renderCategoryTable() {
    categoryTable.innerHTML = "";

    if (categories.length === 0) {
        categoryTable.innerHTML = `
        <tr>
            <td colspan="2" class="text-center text-muted">موردی ثبت نشده است</td>
        </tr>`;
        return;
    }

    categories.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.desc}</td>
        `;
        categoryTable.appendChild(tr);
    });
}

// نمایش اولیه
renderCategoryTable();

