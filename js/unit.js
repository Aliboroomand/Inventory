// عناصر فرم
const unitForm = document.getElementById("unitForm");
const unitName = document.getElementById("unitName");
const unitDesc = document.getElementById("unitDesc");
const unitTable = document.getElementById("unitTable");

// آرایه موقت برای جدول
let units = [];

// ثبت واحد شمارش
unitForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = unitName.value.trim();
    if (!name) { alert("نام واحد را وارد کنید"); return; }

    units.push({
        name: name,
        desc: unitDesc.value.trim() || "-"
    });

    unitForm.reset();
    renderUnitTable();
});

// نمایش جدول
function renderUnitTable() {
    unitTable.innerHTML = "";

    if (units.length === 0) {
        unitTable.innerHTML = `
        <tr>
            <td colspan="2" class="text-center text-muted">موردی ثبت نشده است</td>
        </tr>`;
        return;
    }

    units.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.name}</td>
            <td>${u.desc}</td>
        `;
        unitTable.appendChild(tr);
    });
}

// نمایش اولیه
renderUnitTable();

