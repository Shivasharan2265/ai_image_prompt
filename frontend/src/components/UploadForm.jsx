import { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Stack,
  Chip,
  Alert
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function UploadForm({ setResults, setImagesPreview }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedFiles.length || !prompt) {
      alert("Add images and a prompt!");
      return;
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    selectedFiles.forEach((file) => formData.append("images", file));

    setLoading(true);

    try {
      const res = await axios.post("https://ai-image-prompt.onrender.com/api/images/process", formData);
      setResults(res.data.results);
      setSelectedFiles([]);
      setImagesPreview([]);
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || "Processing failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Stack spacing={2}>
        <TextField
          fullWidth
          size="small"
          label="Prompt"
          placeholder="e.g., Remove background or make it blue"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          size="small"
        >
          Choose Images
          <input
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setSelectedFiles(files);
              setImagesPreview(files);
            }}
          />
        </Button>

        {selectedFiles.length > 0 && (
          <Box>
            <Chip 
              label={`${selectedFiles.length} file(s) selected`} 
              size="small" 
              color="primary"
              onDelete={() => {
                setSelectedFiles([]);
                setImagesPreview([]);
              }}
            />
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          size="small"
        >
          {loading ? "Processing..." : "Generate"}
        </Button>
      </Stack>
    </Box>
  );
}