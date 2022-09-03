const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");
const host = "https://innshare.herokuapp.com/"
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const progressContainer = document.querySelector('.progress-container');
// const bgProgress = document.querySelector('.bg-progress');
const progressBar = document.querySelector('.progress-bar')
const percentDiv = document.querySelector('#percent');

const fileURLInput = document.querySelector('#fileURL');
const sharingContainer = document.querySelector('.sharing-container');
const copyBtn = document.querySelector("#copy-btn");
const cpBtn = document.querySelector(".cp-btn");


const emailForm = document.querySelector("#email-form");

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged")
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");

    const files = e.dataTransfer.files;

    if (files.length) {
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", () => {

    uploadFile(); /* here we can by default select only one file at a time so there is no need to check for files.length or to send file in file input explicitly */

})

browseBtn.addEventListener("click", () => {
    fileInput.click();
})

copyBtn.addEventListener("click", () => {
    fileURLInput.select();
    document.execCommand("copy");
    cpBtn.classList.add("active");
    window.getSelection().removeAllRanges();
    setTimeout(() => {

        cpBtn.classList.remove("active");

    }, 2500)



})

uploadFile = () => {
    progressContainer.style.display = "block";
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);


    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response))
        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);


};

const updateProgress = (e) => {

    const percent = Math.round((e.loaded / e.total) * 100);
    // console.log(percent);
    // bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = `${percent}%`;
    progressBar.style.transform = `scaleX(${percent / 100})`

}

const showLink = ({ file: url }) => {
    console.log(url);
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURLInput.value = url;
}

emailForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const url = fileURLInput.value;

    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value
    };

    console.table(formData)
});

fetch(emailURL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",

    },
    body: JSON.stringify(formData),
}).then((res) => res.json())
    .then(data => {
        console.log(data)
    })

/* uploadfile = async () => {

    const response = await fetch(uploadURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    // enter you logic when the fetch is successful
    console.log(data);

} */