"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Mic, Send, Trash } from "lucide-react";
import { useTheme } from "next-themes";

type Record = {
  id: number;
  name: string;
  file: any;
};

let recorder: MediaRecorder;
let recordingChunks: BlobPart[] = [];
let timerTimeout: NodeJS.Timeout;

export const AudioRecorder = () => {
  const { theme } = useTheme();
  // ============ STATES ============
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingFinished, setIsRecordingFinished] =
    useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [currentRecord, setCurrentRecord] = useState<Record>({
    id: -1,
    name: "",
    file: null,
  });
  const hours = Math.floor(timer / 3600);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const [hourLeft, hourRight] = String(hours).padStart(2, "0").split("");
  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split("");
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split("");

  // ============ REFS ============
  const mediaRecorderRef = useRef<{
    stream: MediaStream | null;
    analyser: AnalyserNode | null;
    mediaRecorder: MediaRecorder | null;
  }>({
    stream: null,
    analyser: null,
    mediaRecorder: null,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<any>(null);

  function startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          setIsRecording(true);
          // ============ Analyzing ============
          const AudioContext = window.AudioContext;
          const audioCtx = new AudioContext();
          const analyser = audioCtx.createAnalyser();
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          mediaRecorderRef.current = {
            stream,
            analyser,
            mediaRecorder: null,
          };

          const mimeType = MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : MediaRecorder.isTypeSupported("audio/wav")
            ? "audio/wav"
            : "audio/mpeg";

          const options = { mimeType };
          mediaRecorderRef.current.mediaRecorder = new MediaRecorder(
            stream,
            options
          );
          mediaRecorderRef.current.mediaRecorder.start();

          // ============ Recording ============
          recorder = new MediaRecorder(stream);
          recorder.start();
          recorder.ondataavailable = (e) => {
            recordingChunks.push(e.data);
          };
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    }
  }
  function stopRecording() {
    recorder.onstop = () => {
      const recordBlob = new Blob(recordingChunks, {
        type: "audio/ogg; codecs=opus",
      });
      downloadBlob(recordBlob);

      setCurrentRecord({
        ...currentRecord,
        file: window.URL.createObjectURL(recordBlob),
      });
      recordingChunks = [];
    };

    recorder.stop();

    setIsRecording(false);
    setIsRecordingFinished(true);
    setTimer(0);
    clearTimeout(timerTimeout);
  }
  function downloadBlob(blob: Blob) {
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${new Date().getMilliseconds()}.mp3`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  function resetRecording() {
    if (recorder) {
      recorder.onstop = () => {
        recordingChunks = [];
      };
      recorder.stop();
    } else {
      alert("recorder instance is null!");
    }

    setIsRecording(false);
    setIsRecordingFinished(true);
    setTimer(0);
    clearTimeout(timerTimeout);
  }
  const handleSubmit = () => {
    stopRecording();
  };
  useEffect(() => {
    if (isRecording) {
      timerTimeout = setTimeout(() => {
        setTimer(timer + 1);
      }, 1000);
    }
  }, [isRecording, timer]);

  // ============ Visualizer ============
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const drawWaveform = (dataArray: Uint8Array) => {
      if (!canvasCtx) return;
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      // canvasCtx.fillStyle = theme === "light" ? "#BFBFBF" : "#27272A";
      canvasCtx.fillStyle = "#FF0000";

      const barWidth = 1;
      const spacing = 1;
      const maxBarHeight = HEIGHT / 2.5;
      const numBars = Math.floor(WIDTH / (barWidth + spacing));

      for (let i = 0; i < numBars; i++) {
        const barHeight = Math.pow(dataArray[i] / 128.0, 8) * maxBarHeight;
        const x = (barWidth + spacing) * i;
        const y = HEIGHT / 2 - barHeight / 2;

        canvasCtx.fillRect(x, y, barWidth, barHeight);
      }
    };

    const visualizeVolume = () => {
      if (
        !mediaRecorderRef.current?.stream?.getAudioTracks()[0]?.getSettings()
          .sampleRate
      )
        return;
      const bufferLength =
        (mediaRecorderRef.current?.stream?.getAudioTracks()[0]?.getSettings()
          .sampleRate as number) / 100;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationRef.current = requestAnimationFrame(draw);
        mediaRecorderRef.current?.analyser?.getByteTimeDomainData(dataArray);
        drawWaveform(dataArray);
      };

      draw();
    };

    if (isRecording) {
      visualizeVolume();
    } else {
      if (!canvasCtx) return;
      cancelAnimationFrame(animationRef.current);
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  return (
    <div className="flex h-12 w-full items-center justify-center gap-4 max-w-5xl">
      {/* ========== Timer ========== */}
      {isRecording ? (
        <div className="hidden items-center justify-center gap-1 font-mono font-medium text-foreground md:flex">
          <span className="rounded-md border bg-background p-2 text-foreground">
            {hourLeft}
          </span>
          <span className="rounded-md border bg-background p-2 text-foreground">
            {hourRight}
          </span>
          <span>:</span>
          <span className="rounded-md border bg-background p-2 text-foreground">
            {minuteLeft}
          </span>
          <span className="rounded-md border bg-background p-2 text-foreground">
            {minuteRight}
          </span>
          <span>:</span>
          <span className="rounded-md border bg-background p-2 text-foreground">
            {secondLeft}
          </span>
          <span className="rounded-md border bg-background p-2 text-foreground ">
            {secondRight}
          </span>
        </div>
      ) : null}
      <canvas ref={canvasRef} className="h-full w-full bg-secondary" />
      <div className="flex gap-4 ">
        {/* ========== Delete recording button ========== */}
        {isRecording ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={resetRecording}
                size={"icon"}
                variant={"destructive"}
              >
                <Trash size={15} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="m-2">
              <span> Delete ongoing recording</span>
            </TooltipContent>
          </Tooltip>
        ) : null}

        {/* ========== Start and send recording button ========== */}
        <Tooltip>
          <TooltipTrigger asChild>
            {!isRecording ? (
              <Button onClick={() => startRecording()} size={"icon"}>
                <Mic size={15} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} size={"icon"}>
                <Send size={15} />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent className="m-2">
            <span>
              {" "}
              {!isRecording ? "Start voice recording" : "Send answer"}{" "}
            </span>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
