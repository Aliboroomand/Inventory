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

renderPeople();

