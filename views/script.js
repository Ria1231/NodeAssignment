const table = document.getElementById('myTable');
const render = document.getElementById('render');
const studentID = document.getElementById('studentID');
const add = document.getElementById('add');
const submit = document.getElementById('submit');
const update = document.getElementById('update');
const cancel = document.getElementById('cancel');

const name_field = document.getElementById('name');
const email_field = document.getElementById('email');
const mobile_field = document.getElementById('mobile');

const message = document.getElementById('message');
const male = document.getElementById('male');
const female = document.getElementById('female');

let gender = '';


function formSubmit() {
    const name = name_field.value.toLowerCase().trim();
    const email = email_field.value.trim();
    const mobile = mobile_field.value.toLowerCase().trim();
    gender = getGender();
    if (name == '') {
        alert('Please Enter Name');
    }
    else if (email === '' && mobile === '') {
        alert('Please Enter Email or mobile ');
    }
    else {
        user = {
            name,
            email,
            mobile,
            gender
        }
        let options = {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        }
        fetch(`http://localhost:8000/apiv2.0/teacher`, options)
            .then(res => res.json())
            .then(d => { message.innerHTML = d.message; })
        // renderData();
        clearFormData();
    }

}

async function renderData() {
    const response = await fetch(`http://localhost:8000/apiv2.0/teacher`);
    const data = await response.json();
    if (data.length > 0) {
        show(data);
        message.innerHTML = '';
    }
    else {
        table.style.display = 'none';
        message.innerHTML = 'No data found';
    }
}

async function editData(id) {
    studentID.value = id;
    const response = await fetch(`http://localhost:8000/apiv2.0/teacher/${id}`);
    const data = await response.json();
    if (data) {
        name_field.value = data.name;
        email_field.value = data.email;
        mobile_field.value = data.mobile;
        document.getElementById(data.gender).checked = true;
        submit.style.display = 'none';
        update.style.display = 'inline';
    }

}


async function updateData() {
    const _id = studentID.value;
    const name = name_field.value.toLowerCase().trim();
    const email = email_field.value.trim();
    const mobile = mobile_field.value.toLowerCase().trim();
    gender = getGender();
    if (name == '') {
        alert('Please Enter Name');
    }
    else if (email === '' && mobile === '') {
        alert('Please Enter Email or mobile ');
    }
    else {
        user = {
            name,
            email,
            mobile,
            gender
        }
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type':
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        }
        fetch(`http://localhost:8000/apiv2.0/teacher/${_id}`, options)
            .then(res => res.json())
            .then(d => { message.innerHTML = d.message; })
        renderData();
        update.style.display = 'none';
        submit.style.display = 'inline';
        clearFormData();
    }

}


function show(data) {
    table.style.display = 'inline'
    let thead =
        ` <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Gender</th>
            <th scope="col">Mobile</th>
            <th scope="col"></th>
        </tr>`;

    const output = data.map(teacher => {

        return `<tr id=${teacher._id}>
            <td class="capitalize" scope="col">${teacher.name}</td>
            <td scope="col">${teacher.email}</td>
            <td class="capitalize" scope="col">${teacher.gender}</td>
            <td class="capitalize" scope="col">${teacher.mobile}</td>
            <td scope="col">
                <button class="btn btn-success mb-2" onclick='editData("${teacher._id}")'>Edit</button>
                <button class="btn btn-danger mb-2" onclick='deleteData("${teacher._id}")'>Delete</button>
            </td>
        </tr>`
    }).join('');
    table.innerHTML = thead + output;
}

async function deleteData(id) {
    fetch(`http://localhost:8000/apiv2.0/teacher/delete/${id}`)
        .then(res => res.json())
        .then(d => {
            message.innerHTML = d.message || 'Student Deleted...';
            renderData();
        })
}

function getGender() {
    if (male.checked == true) return 'male';
    if (female.checked == true) return 'female';
}
const clearFormData = () => {
    name_field.value = '';
    email_field.value = '';
    mobile_field.value = '';
    studentID.value = '';
    male.checked = false;
    female.checked = false;
}

const cancelUpdate = () => {
    fname.value = '';
    lname.value = '';
    studentID.value = '';
    update.style.display = 'none';
    cancel.style.display = 'none';
    add.style.display = 'inline';
}
