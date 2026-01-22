"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";

import MediaPickerDialog from "./MediaPickerDialog";

export type AppFlowStep = {
  title: string;
  description?: string;
  mediaId?: string;
  imageUrl?: string;
};

type Props = {
  value: AppFlowStep[];
  onChange: (steps: AppFlowStep[]) => void;
};

export default function AppFlowEditor({ value, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  function addStep() {
    onChange([
      ...value,
      { title: "", description: "", mediaId: "", imageUrl: "" },
    ]);
  }

  function updateStep(idx: number, patch: Partial<AppFlowStep>) {
    onChange(value.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  function removeStep(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function openPickerFor(idx: number) {
    setActiveIndex(idx);
    setPickerOpen(true);
  }

  return (
    <Paper sx={{ p: 2.5, borderRadius: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={900}>
            Mobile App Flow
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add steps/screens and attach images (dynamic cards)
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={addStep}>
          Add Step
        </Button>
      </Box>

      {value.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No flow steps added.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {value.map((step, idx) => (
            <Card key={idx} sx={{ borderRadius: 3 }}>
              {step.imageUrl ? (
                <CardMedia
                  component="img"
                  height="160"
                  image={step.imageUrl}
                  alt={step.title || `Step ${idx + 1}`}
                  sx={{ objectFit: "cover", bgcolor: "grey.100" }}
                />
              ) : (
                <Box
                  sx={{
                    height: 160,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "grey.100",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No image selected
                  </Typography>
                </Box>
              )}

              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography fontWeight={900}>Step {idx + 1}</Typography>

                  <IconButton color="error" onClick={() => removeStep(idx)} title="Remove step">
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <TextField
                  label="Title"
                  value={step.title}
                  onChange={(e) => updateStep(idx, { title: e.target.value })}
                  fullWidth
                />

                <TextField
                  label="Description"
                  value={step.description || ""}
                  onChange={(e) => updateStep(idx, { description: e.target.value })}
                  fullWidth
                  multiline
                  minRows={2}
                />

                <Button
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  onClick={() => openPickerFor(idx)}
                >
                  Choose Image
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(m) => {
          if (activeIndex !== null) {
            updateStep(activeIndex, { mediaId: m._id, imageUrl: m.url });
          }
          setPickerOpen(false);
        }}
      />
    </Paper>
  );
}
