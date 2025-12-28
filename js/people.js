let people = JSON.parse(localStorage.getItem("people")) || [];

document.getElementById("personForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const type = personType.value;
    const firstName = firstNameInput();
    const lastName = lastNameInput();
    const company = companyName.value.trim();
    const phone = phone.value.trim();
    const code = nationalCode.value.trim();

    if (!type) {
        alert("نوع شخص را انتخاب کنید");
        return;
    }

    const displayName =
        type === "حقیقی"
            ? `${firstName} ${lastName}`
            : company;

    people.push({
        type,
        name: displayName,
        phone,
        code
    });

    localStorage.setItem("people", JSON.stringify(people));
    this.reset();
    renderPeople();
});

function firstNameInput() {
    return document.getElementById("firstName").value.trim();
}

function lastNameInput() {
    return document.getElementById("lastName").value.trim();
}

function renderPeople() {
    const tbody = document.getElementById("peopleTable");
    tbody.innerHTML = "";

    people.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.type}</td>
            <td>${p.name}</td>
            <td>${p.phone}</td>
            <td>${p.code}</td>
        `;
        tbody.appendChild(tr);
    });
}
const personTypeSelect = document.getElementById("personType");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const companyInput = document.getElementById("companyName");

personTypeSelect.addEventListener("change", function () {
    if (this.value === "حقیقی") {
        firstNameInput.disabled = false;
        lastNameInput.disabled = false;
        companyInput.disabled = true;
        companyInput.value = "";
    }

    if (this.value === "حقوقی") {
        firstNameInput.disabled = true;
        lastNameInput.disabled = true;
        companyInput.disabled = false;
        firstNameInput.value = "";
        lastNameInput.value = "";
    }
});


renderPeople();

