# Image-To-Video

Simple application with the premise of converting image files into static soundless video files.

> **Note:** This application is for studying purposes. As mentioned bellow, it's not suited for an production workload.

## [`backend`](backend)

The backend is an NodeJS Azure Function application, meant to be cheap and fast.
But, after some tests, the libs used are not well optimized for the workload.

The idea lies on the following:
* User sends a request to the backend with the image file to be converted together with the target video duration and resolution;
* The backend generates a temporary image file with the request data;
* The file is processed to avoid encoding errors with odd resolution values;
* The file is converted to a MP4 video file with the requested duration and resolution using FFMPEG;
* The video file is sent to the user.

The performance problem lies on FFMPEG, which requires a considerable amount of processing power and RAM to operate properly.

The end result is a very slow and not reliable application.

## [`frontend`](frontend)

The frontend is an ViteJS TypeScript application, meant to be simple and powerful.
In general do it's job and can be used in the final result.

Unfortunately, it's heavily dependent on the backend to work properly.