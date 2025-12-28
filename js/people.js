// ===============================
// Data Load
// ===============================
let people = JSON.parse(localStorage.getItem("people")) || [];

// ===============================
// Elements
// ===============================
const form = document.getElementById("personForm");
const typeSelect = document.getElementById("personType");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const companyName = document.getElementById("companyName");
const phone = document.getElementById("phone");
const nationalCode = document.getElementById("nationalCode");
const tableBody = document.getElementById("peopleTable");

// ===============================
// Field Locking Logic
// ===============================
typeSelect.addEventListener("change", () => {
    if (typeSelect.value === "حقیقی") {
        firstName.disabled = false;
        lastName.disabled = false;
        companyName.disabled = true;
        companyName.value = "";
    }

    if (typeSelect.value === "حقوقی") {
        firstName.disabled = true;
        lastName.disabled = true;
        companyName.disabled = false;
        firstName.value = "";
        lastName.value = "";
    }
});

// ===============================
// Form Submit
// ===============================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const type = typeSelect.value.trim();

    if (!type) {
        alert("نوع شخص را انتخاب کنید");
        return;
    }

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

    const person = {
        id: Date.now(),               // شناسه یکتا
        type: type,
        name: displayName,
        phone: phone.value.trim(),
        code: nationalCode.value.trim()
    };

    people.push(person);
    localStorage.setItem("people", JSON.stringify(people));

    form.reset();
    firstName.disabled = false;
    lastName.disabled = false;
    companyName.disabled = false;

    renderTable();
});

// ===============================
// Render Table
// ===============================
function renderTable() {
    tableBody.innerHTML = "";

    if (people.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    موردی ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }

    people.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.type}</td>
            <td>${p.name}</td>
            <td>${p.phone || "-"}</td>
            <td>${p.code || "-"}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// ===============================
// Initial Load
// ===============================
renderTable();
