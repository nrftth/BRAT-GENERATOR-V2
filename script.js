const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const video = document.getElementById("video");

function drawBrat(text){

    ctx.clearRect(0,0,512,512);

    // background
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,512,512);

    // text
    ctx.fillStyle = "white";
    ctx.font = "bold 45px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    wrapText(text,256,256,380,55);
}

function wrapText(text,x,y,maxWidth,lineHeight){

    const words = text.split(" ");
    let line = "";
    let lines = [];

    for(let n=0;n<words.length;n++){

        let testLine = line + words[n] + " ";
        let width = ctx.measureText(testLine).width;

        if(width > maxWidth && n > 0){

            lines.push(line);
            line = words[n] + " ";

        }else{

            line = testLine;

        }
    }

    lines.push(line);

    let startY = y - ((lines.length - 1) * lineHeight) / 2;

    for(let i=0;i<lines.length;i++){

        ctx.fillText(lines[i],x,startY + (i * lineHeight));

    }
}

function generateBrat(){

    let input = document.getElementById("text").value;

    input = input
        .replace(".brat","")
        .trim();

    if(input === "") return;

    drawBrat(input);
}

function generateVideo(){

    let input = document.getElementById("text").value;

    input = input
        .replace(".bratvid","")
        .trim();

    if(input === "") return;

    let chunks = [];

    const stream = canvas.captureStream(30);

    const recorder = new MediaRecorder(stream,{
        mimeType:"video/webm"
    });

    recorder.ondataavailable = e => {
        chunks.push(e.data);
    };

    recorder.onstop = () => {

        const blob = new Blob(chunks,{
            type:"video/webm"
        });

        const url = URL.createObjectURL(blob);

        video.src = url;
    };

    recorder.start();

    let angle = 0;

    const animate = setInterval(()=>{

        ctx.save();

        ctx.clearRect(0,0,512,512);

        ctx.translate(256,256);

        ctx.rotate(angle);

        ctx.fillStyle = "black";
        ctx.fillRect(-256,-256,512,512);

        ctx.fillStyle = "white";
        ctx.font = "bold 45px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        wrapText(input,0,0,380,55);

        ctx.restore();

        angle += 0.03;

    },33);

    setTimeout(()=>{

        clearInterval(animate);

        recorder.stop();

    },3000);
}

function downloadImage(){

    const link = document.createElement("a");

    link.download = "brat.png";

    link.href = canvas.toDataURL();

    link.click();
}

function downloadVideo(){

    if(video.src === "") return;

    const link = document.createElement("a");

    link.download = "bratvid.webm";

    link.href = video.src;

    link.click();
}
