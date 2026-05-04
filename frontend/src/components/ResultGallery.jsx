import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography
} from "@mui/material";

export default function ResultGallery({ results }) {
  const [downloadFormat, setDownloadFormat] = useState("original");

  const downloadImage = async (url, filename, format = "original") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      let finalBlob = blob;
      let finalFilename = filename;
      
      if (format === "webp") {
        finalBlob = await convertToWebP(blob);
        finalFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }
      
      const downloadUrl = URL.createObjectURL(finalBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert("Failed to download image");
    }
  };

  const convertToWebP = (blob) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((webpBlob) => resolve(webpBlob), "image/webp", 0.9);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  };

  const bulkDownload = async () => {
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.type === "image") {
        await new Promise(resolve => setTimeout(resolve, 500));
        await downloadImage(result.url, result.filename, downloadFormat);
      }
    }
  };

  if (!results || results.length === 0) return null;

  const imageResults = results.filter(r => r.type === "image");

  return (
    <Box>
      {imageResults.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: "flex-end" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Format</InputLabel>
            <Select
              value={downloadFormat}
              label="Format"
              onChange={(e) => setDownloadFormat(e.target.value)}
            >
              <MenuItem value="original">JPEG</MenuItem>
              <MenuItem value="webp">WebP</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="outlined" 
            size="small"
            onClick={bulkDownload}
          >
            Download All ({imageResults.length})
          </Button>
        </Stack>
      )}

      <Grid container spacing={2}>
        {results.map((result, i) => (
          <Grid item size={{xs:12, sm:6, md:4}} key={i}>
            <Card>
              {result.type === "image" ? (
                <>
                  <CardMedia
                    component="img"
                    height="200"
                    image={result.url}
                    alt={`Result ${i + 1}`}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardActions sx={{ justifyContent: "space-between", p: 1 }}>
                    <Button 
                      size="small" 
                      onClick={() => downloadImage(result.url, result.filename, "original")}
                    >
                      JPG
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => downloadImage(result.url, result.filename, "webp")}
                    >
                      WebP
                    </Button>
                  </CardActions>
                </>
              ) : (
                <Box sx={{ p: 2, minHeight: 200, display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {result.data}
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}