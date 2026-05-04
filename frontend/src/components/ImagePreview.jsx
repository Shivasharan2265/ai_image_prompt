import { useEffect } from "react";
import { Box, Stack, Avatar } from "@mui/material";

export default function ImagePreview({ images }) {
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img instanceof File && img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  if (images.length === 0) return null;

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
      {images.map((img, i) => {
        const previewUrl = img instanceof File ? URL.createObjectURL(img) : img;
        return (
          <Avatar
            key={i}
            src={previewUrl}
            variant="rounded"
            sx={{ width: 80, height: 80 }}
          />
        );
      })}
    </Stack>
  );
}