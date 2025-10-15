const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const modal = document.getElementById('confirmation-modal');
const confirmationDetails = document.getElementById('confirmation-details');
const confirmButton = document.getElementById('confirm-button');
const cancelButton = document.getElementById('cancel-button');
const submitButton = document.getElementById('submit-button');

let formDataToSubmit;

// Cookie functions
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Check for cookie on page load
window.addEventListener('load', () => {
    if (getCookie('formSubmitted')) {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#ccc';
        submitButton.style.cursor = 'not-allowed';
        form.innerHTML = '<p style="text-align: center; font-size: 1.2em;">You have already submitted the form. To make changes, contact DhK.</p>';
    }
});


submitButton.addEventListener('click', () => {
    const formData = new FormData(form);
    const name = formData.get('name');
    const nxt_id = formData.get('nxt_id');
    const branch = formData.get('branch');
    const ntfy_id = formData.get('ntfy_id');
    const reason = formData.get('reason');

    // Simple validation
    if (!name || !nxt_id || !ntfy_id || !reason) {
        formMessage.textContent = 'Please fill out all required fields.';
        formMessage.style.color = 'red';
        return;
    }


    formDataToSubmit = {
        name,
        nxt_id,
        branch,
        ntfy_id,
        reason
    };

    confirmationDetails.innerHTML = `
        <p><strong>NAME:</strong> ${name}</p>
        <p><strong>NXT ID:</strong> ${nxt_id}</p>
        <p><strong>Branch:</strong> ${branch}</p>
        <p><strong>ntfy subscription ID:</strong> ${ntfy_id}</p>
        <p><strong>Reason:</strong> ${reason}</p>
    `;

    modal.style.display = 'block';
});

cancelButton.addEventListener('click', () => {
    modal.style.display = 'none';
    location.reload();
});

confirmButton.addEventListener('click', () => {
    // Disable buttons to prevent multiple clicks
    confirmButton.disabled = true;
    cancelButton.disabled = true;
    confirmButton.textContent = 'Submitting...';
    confirmButton.style.backgroundColor = '#ccc';
    confirmButton.style.cursor = 'not-allowed';
    cancelButton.style.backgroundColor = '#ccc';
    cancelButton.style.cursor = 'not-allowed';

    const {
        name,
        nxt_id,
        branch,
        ntfy_id,
        reason
    } = formDataToSubmit;

    // Replace with your Google Apps Script web app URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwJT2_5ZQjSwAl1qreLValgRliGyLbd8w6ppVDk3ahtk2BuZHf0neYs0MHqU-fwZWGJ9A/exec';

    const url = `${scriptURL}?name=${encodeURIComponent(name)}&nxt_id=${encodeURIComponent(nxt_id)}&branch=${encodeURIComponent(branch)}&ntfy_id=${encodeURIComponent(ntfy_id)}&reason=${encodeURIComponent(reason)}`;

    fetch(url, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                setCookie('formSubmitted', 'true', 365); // Set cookie for 1 year
                formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                formMessage.style.color = 'green';
            } else {
                throw new Error('Something went wrong.');
            }
        })
        .catch(error => {
            formMessage.textContent = 'An error occurred. Please try again later.';
            formMessage.style.color = 'red';
            console.error('Error!', error.message);
        })
        .finally(() => {
            location.reload();
        });
});
