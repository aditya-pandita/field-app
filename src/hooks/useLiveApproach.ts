import { useState, useCallback, useRef } from "react";
import type { NewRecording } from "@/lib/firebase/types";
import { saveRecording, getUserRecordings } from "@/lib/firebase/queries/recordings";

export type LivePhase = "idle" | "requesting" | "recording" | "processing" | "reviewing" | "saved" | "error";

export function useLiveApproach(userId: string) {
  const [phase, setPhase] = useState<LivePhase>("idle");
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [savedRecord, setSavedRecord] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [amplitude, setAmplitude] = useState(0);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const checkBrowserSupport = useCallback(() => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Your browser does not support audio recording. Use Chrome, Firefox, or Safari 14.5+.");
      setPhase("error");
      return false;
    }
    return true;
  }, []);

  const updateAmplitude = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAmplitude(average / 255);
    
    animationFrameRef.current = requestAnimationFrame(updateAmplitude);
  }, []);

  const startRecording = useCallback(async () => {
    if (!checkBrowserSupport()) return;

    setError(null);
    setPhase("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      let mimeType = "";
      if (MediaRecorder.isTypeSupported("webm;codecs=opus")) {
        mimeType = "webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("webm")) {
        mimeType = "webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else {
        mimeType = "";
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = handleRecordingStop;

      recorder.start(250);
      startTimeRef.current = Date.now();
      setPhase("recording");

      timerRef.current = setInterval(() => {
        setElapsedSecs(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      updateAmplitude();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start recording");
      setPhase("error");
    }
  }, [checkBrowserSupport, updateAmplitude]);

  const handleRecordingStop = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setPhase("processing");
    setAmplitude(0);

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const response = await fetch("/api/approach/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transcription failed");
      }

      const data = await response.json();
      setTranscript(data.transcript || "");
      setPhase("reviewing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transcription failed");
      setPhase("error");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const saveToFirestore = useCallback(async () => {
    if (!transcript) return;

    setLoading(true);
    try {
      const recordingData: NewRecording = {
        userId,
        sessionId,
        recordedAt: new Date(),
        durationSecs: elapsedSecs,
        transcript,
        notes,
        tags,
        isReviewed: false,
      };

      const saved = await saveRecording(userId, recordingData);
      setSavedRecord(saved);
      setPhase("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save recording");
    } finally {
      setLoading(false);
    }
  }, [userId, sessionId, elapsedSecs, transcript, notes, tags]);

  const reset = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setPhase("idle");
    setElapsedSecs(0);
    setTranscript("");
    setNotes("");
    setTags([]);
    setSessionId(null);
    setSavedRecord(null);
    setError(null);
    setAmplitude(0);

    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    streamRef.current = null;
    analyserRef.current = null;
  }, []);

  const isRecording = phase === "recording";
  const isProcessing = phase === "processing";
  const canSave = phase === "reviewing" && transcript.length > 0;

  const toggleTag = useCallback((tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  return {
    phase,
    elapsedSecs,
    transcript,
    notes,
    setNotes,
    tags,
    toggleTag,
    sessionId,
    setSessionId,
    savedRecord,
    error,
    amplitude,
    isRecording,
    isProcessing,
    canSave,
    startRecording,
    stopRecording,
    saveToFirestore,
    reset,
  };
}
