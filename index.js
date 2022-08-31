const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");
const host = "https://innshare.herokuapp.com/"
const uploadURL = `${host}api/files`;

const progressContainer = document.querySelector('.progress-container');
// const bgProgress = document.querySelector('.bg-progress');
const progressBar = document.querySelector('.progress-bar')
const percentDiv = document.querySelector('#percent');

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

const showLink = ({ file }) => {
    console.log(file);
}

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