const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const video = document.getElementById("video");

canvas.width = 512;
canvas.height = 512;

function drawBrat(text){

    ctx.clearRect(0,0,512,512);

    // background putih
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,512,512);

    // text hitam
    ctx.fillStyle = "black";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    wrapText(text,256,256,400,60);
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

    let input = document
        .getElementById("text")
        .value
        .replace(".brat","")
        .trim();

    if(!input) return;

    drawBrat(input);
}

function generateVideo(){

    let input = document
        .getElementById("text")
        .value
        .replace(".bratvid","")
        .trim();

    if(!input) return;

    const words = input.split(" ");

    let chunks = [];

    const stream = canvas.captureStream(60);

    const recorder = new MediaRecorder(stream,{
        mimeType:"video/webm"
    });

    recorder.ondataavailable = e=>{
        chunks.push(e.data);
    };

    recorder.onstop = ()=>{

        const blob = new Blob(chunks,{
            type:"video/webm"
        });

        const url = URL.createObjectURL(blob);

        video.src = url;
    };

    recorder.start();

    let start = performance.now();

    function animate(now){

        let elapsed = now - start;

        ctx.clearRect(0,0,512,512);

        // background putih
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,512,512);

        ctx.fillStyle = "black";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const spacing = 60;

        for(let i=0;i<words.length;i++){

            const delay = i * 800;

            if(elapsed > delay){

                // smooth animation
                let progress = Math.min(
                    (elapsed - delay) / 500,
                    1
                );

                // easing
                progress = 1 - Math.pow(1 - progress,3);

                let y =
                    256 +
                    (i * spacing) -
                    ((words.length - 1) * spacing / 2);

                // muncul dari bawah
                let offsetY = (1 - progress) * 50;

                ctx.globalAlpha = progress;

                ctx.fillText(
                    words[i],
                    256,
                    y + offsetY
                );

                ctx.globalAlpha = 1;
            }
        }

        if(elapsed < (words.length * 800) + 1500){

            requestAnimationFrame(animate);

        }else{

            recorder.stop();

        }
    }

    requestAnimationFrame(animate);
}
