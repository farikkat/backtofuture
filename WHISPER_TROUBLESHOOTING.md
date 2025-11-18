# Databricks Whisper Integration Troubleshooting

## Current Status

### Issues Identified

1. **WebM Format Not Supported**
   - Browser MediaRecorder captures audio in WebM/Opus format
   - Databricks Whisper endpoint expects WAV, MP3, or FLAC
   - Error: "Failed to process the input audio data"

2. **Schema Mismatch**
   - Whisper endpoint schema: `[0: binary (required)]`
   - Tried 10+ payload formats, all failed
   - The model expects binary data at index position 0 (not named fields)

3. **Format Signature Detected**
   - WebM files start with hex: `1a45dfa3` (EBML header)
   - Base64: `GkXfo...`
   - Our recordings are valid WebM files, but unsupported by the model

## Solutions

### Option 1: Backend Audio Conversion (Recommended)

Install ffmpeg and convert WebM to WAV on the backend:

```bash
# Install ffmpeg
# Windows: choco install ffmpeg
# Mac: brew install ffmpeg
# Linux: apt-get install ffmpeg

# Install Node.js package
cd backend
npm install fluent-ffmpeg @ffmpeg-installer/ffmpeg
```

Then update `databricks-service.js` to convert audio before sending.

### Option 2: Use External Transcription Service

Instead of Databricks Whisper, use:
- OpenAI Whisper API (whisper-1 model)
- Azure Speech Services
- Google Speech-to-Text
- AssemblyAI

These services handle WebM format natively.

### Option 3: Direct File Upload to Databricks

Check if Databricks supports multipart/form-data file uploads instead of JSON payloads.
The model serving endpoint might have a `/invocations` endpoint that accepts files.

### Option 4: Pre-process Audio with Web Audio API

Convert WebM to WAV in the browser using Web Audio API before uploading:

```javascript
// Decode WebM, re-encode as WAV
const audioContext = new AudioContext();
const audioBuffer = await audioContext.decodeAudioData(webmBlob);
const wavBlob = audioBufferToWav(audioBuffer);
```

## Recommended Next Steps

1. **Short-term**: Use OpenAI Whisper API as a fallback
2. **Medium-term**: Install ffmpeg and convert on backend  
3. **Long-term**: Contact Databricks support about WebM support or file upload endpoints

## Error Log Reference

### Tested Payload Formats (All Failed)

1. `dataframe_split` with string "0" column
2. `dataframe_records` with string "0" key
3. `dataframe_split` with numeric indexed column
4. `dataframe_records` with numeric indexed input
5. `inputs` as 2D array
6. `dataframe_records` with 'audio' key
7. `dataframe_split` with 'audio' column
8. `instances` (TensorFlow style)
9. `inputs` array (simple)
10. Raw binary bytes array

All formats either:
- Failed with: "Model is missing inputs [0]" (for named fields)
- Failed with: "Failed to process the input audio data" (for WebM format)

