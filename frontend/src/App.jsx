import { useState } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import UploadForm from "./components/UploadForm";
import ImagePreview from "./components/ImagePreview";
import ResultGallery from "./components/ResultGallery";

function App() {
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gemini Image Studio
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Transform your images with AI
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        <UploadForm setResults={setResults} setImagesPreview={setImages} />
        
        {images.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Original Images</Typography>
            <ImagePreview images={images} />
          </Box>
        )}

        {results.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>AI Results</Typography>
            <ResultGallery results={results} />
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;