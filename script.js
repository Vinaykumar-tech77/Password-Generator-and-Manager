// Toggles the password input state based on the checkbox
function togglePasswordInput() {
    const isChecked = document.getElementById("useGenerated").checked;
    const generatorOptions = document.getElementById("generatorOptions");
    const passwordInput = document.getElementById("password");

    if (isChecked) {
        generatorOptions.style.display = "block";
        passwordInput.readOnly = true;
        passwordInput.value = ""; // Clear input
    } else {
        generatorOptions.style.display = "none";
        passwordInput.readOnly = false;
        passwordInput.value = ""; // Clear input
    }
}

// Generates a strong password of given length ONCE
let generated = false;
function generatePassword() {
    if (generated) return; // Prevent multiple generations

    const lengthInput = document.getElementById("passwordLength");
    const length = parseInt(lengthInput.value);

    if (isNaN(length) || length < 8) {
        alert("Please enter a password length of more than 7.");
        return;
    }

    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.<>?";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randIndex = Math.floor(Math.random() * chars.length);
        password += chars[randIndex];
    }

    const passwordInput = document.getElementById("password");
    passwordInput.value = password;

    lengthInput.value = ""; // Clear length input
    generated = true;
}

// Masks password with *
function maskPassword(pass) {
    return "*".repeat(pass.length);
}

// Copies text to clipboard
function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            const alertEl = document.querySelector(".alert");
            alertEl.classList.remove("alert");
            setTimeout(() => {
                alertEl.style.display = "none";
            }, 2000);
        },
        () => {
            alert("Copying Failed!");
        }
    );
}

// Deletes password from storage
function deletePassword(platform) {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    let arrUpdated = arr.filter((e) => e.platform !== platform);
    localStorage.setItem("passwords", JSON.stringify(arrUpdated));
    alert(`Successfully Deleted ${platform}'s Password!`);
    showPasswords();
}

// Shows stored passwords
function showPasswords() {
    let tb = document.querySelector("table");
    let data = localStorage.getItem("passwords");

    if (data == null || JSON.parse(data).length === 0) {
        tb.innerHTML = "No Data Available!";
    } else {
        tb.innerHTML = `<tr>
            <th>Platform</th>
            <th>Username</th>
            <th>Password</th>
            <th>Delete</th>
        </tr>`;

        let arr = JSON.parse(data);
        let str = "";

        for (let element of arr) {
            str += `<tr>
                <td>${element.platform}<img onclick="copyText('${element.platform}')" src="copy.svg" alt="Copy Icon" /></td>
                <td>${element.username}<img onclick="copyText('${element.username}')" src="copy.svg" alt="Copy Icon" /></td>
                <td>${maskPassword(element.password)}<img onclick="copyText('${element.password}')" src="copy.svg" alt="Copy Icon" /></td>
                <td><button class="btnn" onclick="deletePassword('${element.platform}')">Delete</button></td>
            </tr>`;
        }

        tb.innerHTML += str;
    }

    // Reset input fields
    document.getElementById("platform").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    generated = false; // allow re-generation next time
}

// Save new credentials
document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();

    let platformVal = document.getElementById("platform").value.trim();
    let usernameVal = document.getElementById("username").value.trim();
    let passwordVal = document.getElementById("password").value.trim();

    if (!platformVal || !usernameVal || !passwordVal) {
        alert("Platform, Username, and Password are required!");
        return;
    }

    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    passwords.push({
        platform: platformVal,
        username: usernameVal,
        password: passwordVal,
    });

    localStorage.setItem("passwords", JSON.stringify(passwords));
    alert("Credentials Saved!");
    showPasswords();
});

// Initial call
console.log("Working...");
showPasswords();
