export default function getVideo(length, type){
    const videos = AMVideos();
    let video;
    if(length === 'five'){
        video = videos.five;
    } else if(length === 'ten'){
        video = videos.ten;
    } else if(length === 'thirty'){
        video = videos.thirty;
    } else if(length === 'fortyfive'){
        video = videos.fortyfive;
    }
    if(type === 'motivational'){
        video = video.motivational;
    } else if(type === 'perspectives'){
        video = video.perspectives;
    } else if(type === 'selfwork'){
        video = video.selfwork;
    }

    const max = video.length - 1;
    const index = Math.floor(Math.random() * max);
    return video[index];
}

function AMVideos() {
    const content = {
        "five": {
            "motivational": [
                {
                    "index": 0,
                    "name": "Matthey McConaughey on defining what success means to you.",
                    "url": "https://www.youtube.com/watch?v=OKJImnk-gzQ&ab_channel=VideoAdvice",
                    "takeaways": ""
                }
            ],
            "perspectives": [
                {
                    "index": 0,
                    "name": "",
                    "url": "",
                    "takeaways": ""
                }
            ],
            "selfwork": [
                {
                    "index": 0,
                    "name": "",
                    "url": "",
                    "takeaways": ""
                }
            ]
        },
        "ten": {
            "motivational": [
                {
                    "index": 0,
                    "name": "Kobe Bryant Work Ethic",
                    "url": "https://www.youtube.com/watch?v=GhNhWsv3NlY",
                    "takeaways": ""
                }
            ],
            "perspectives": [
                {
                    "index": 0,
                    "name": "A Fun Thought Experiment by Kurzegesagt",
                    "url": "https://www.youtube.com/watch?v=h6fcK_fRYaI",
                    "takeaways": ""
                },
                {
                    "index": 0,
                    "name": "Intro to Stoicism",
                    "url": "https://www.youtube.com/watch?v=EFkyxzJtiv4",
                    "takeaways": ""
                }
            ],
            "selfwork": [
                {
                    "index": 0,
                    "name": "",
                    "url": "",
                    "takeaways": ""
                }
            ]
        },
        "thirty": {
            "motivational": [
                {
                    "index": 0,
                    "name": "",
                    "url": "",
                    "takeaways": ""
                }
            ],
            "perspectives": [
                {
                    "index": 0,
                    "name": "",
                    "url": "",
                    "takeaways": ""
                }
            ],
            "selfwork": [
                {
                    "index": 0,
                    "name": "",
                    "url": "",
                    "takeaways": ""
                }
            ]
        },
        "fortyfive": {
            "motivational": [
                {
                    "index": 0,
                    "name": "",
                    "url": "",
                    "takeaways": ""
                }
            ],
            "perspectives": [
                {
                    "index": 0,
                    "name": "",
                    "url": "",
                    "takeaways": ""
                }
            ],
            "selfwork": [
                {
                    "index": 0,
                    "name": "",
                    "url": "",
                    "takeaways": ""
                }
            ]
        },
    }
    return content;
}