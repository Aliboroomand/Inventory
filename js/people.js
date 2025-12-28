// عناصر فرم
const form = document.getElementById("personForm");
const typeSelect = document.getElementById("personType");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const companyName = document.getElementById("companyName");
const phone = document.getElementById("phone");
const nationalCode = document.getElementById("nationalCode");
const tableBody = document.getElementById("peopleTable");

// آرایه موقت برای نمایش جدول
let people = [];

// ======== فیلدها هوشمند ========
typeSelect.addEventListener("change", () => {
    if (typeSelect.value === "حقیقی") {
        firstName.disabled = false;
        lastName.disabled = false;
        companyName.disabled = true;
        companyName.value = "";
    } else if (typeSelect.value === "حقوقی") {
        firstName.disabled = true;
        lastName.disabled = true;
        firstName.value = "";
        lastName.value = "";
        companyName.disabled = false;
    } else {
        firstName.disabled = false;
        lastName.disabled = false;
        companyName.disabled = false;
    }
});

// ======== ثبت شخص ========
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = typeSelect.value.trim();
    if (!type) { alert("نوع شخص را انتخاب کنید"); return; }

    let displayName = "";
    if (type === "حقیقی") {
        if (!firstName.value.trim() || !lastName.value.trim()) {
            alert("نام و نام خانوادگی را وارد کنید");
            return;
        }
        displayName = firstName.value.trim() + " " + lastName.value.trim();
    }
    if (type === "حقوقی") {
        if (!companyName.value.trim()) {
            alert("نام شرکت را وارد کنید");
            return;
        }
        displayName = companyName.value.trim();
    }

    // داده فقط در آرایه موقت
    people.push({
        type: type,
        name: displayName,
        phone: phone.value.trim() || "-",
        code: nationalCode.value.trim() || "-"
    });

    form.reset();
    firstName.disabled = false;
    lastName.disabled = false;
    companyName.disabled = false;
    typeSelect.value = "";

    setTimeout(() => { firstName.focus(); }, 0);
    
    renderTable();
});

// ======== نمایش جدول ========
function renderTable() {
    tableBody.innerHTML = "";

    if (people.length === 0) {
        tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center text-muted">موردی ثبت نشده است</td>
        </tr>`;
        return;
    }

    people.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.type}</td>
            <td>${p.name}</td>
            <td>${p.phone}</td>
            <td>${p.code}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// نمایش اولیه
renderTable();
