"use client";

import * as React from "react";
import { Box, Divider, IconButton, Stack, Tooltip } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExt from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";

// ✅ Table support
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

// ✅ Icons
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import HighlightIcon from "@mui/icons-material/Highlight";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import TableChartIcon from "@mui/icons-material/TableChart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ImageIcon from "@mui/icons-material/Image";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
};

export default function TiptapEditor({ value, onChange, minHeight = 280 }: Props) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const editor = useEditor({
    immediatelyRender: false, // ✅ fix hydration mismatch Next.js
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),

      Dropcursor,
      Gapcursor,

      Underline,

      LinkExt.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Highlight,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      // ✅ Image
      Image.configure({
        allowBase64: false,
        inline: false,
      }),

      // ✅ Table
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // ✅ keep editor in sync while editing existing post
  React.useEffect(() => {
    if (!editor) return;
    const html = editor.getHTML();
    if (html !== (value || "")) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  function iconBtn(active?: boolean) {
    return {
      borderRadius: 2,
      bgcolor: active ? "rgba(25,118,210,0.14)" : "transparent",
      "&:hover": {
        bgcolor: active ? "rgba(25,118,210,0.18)" : "rgba(0,0,0,0.06)",
      },
    };
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter link URL", prev || "");
    if (url === null) return;

    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  // ✅ upload -> returns URL
  async function uploadToServer(file: File) {
    const fd = new FormData();
    fd.append("files", file);

    const res = await fetch("/api/media/upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Upload failed");

    const uploaded = json?.data?.[0];
    if (!uploaded?.url) throw new Error("Upload response invalid");
    return uploaded.url as string;
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!editor) return;
    try {
      setUploading(true);

      const url = await uploadToServer(file);

      editor.chain().focus().setImage({ src: url }).run();
      editor.chain().focus().insertContent("<p></p>").run();
    } catch (err: any) {
      alert(err?.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // ✅ delete selected image
  const deleteSelectedImage = () => {
    if (!editor) return;

    // If currently image selected
    if (editor.isActive("image")) {
      editor.chain().focus().deleteSelection().run();
      return;
    }

    // else try selecting parent node
    editor.chain().focus().selectParentNode().run();
    if (editor.isActive("image")) {
      editor.chain().focus().deleteSelection().run();
    }
  };

  // ✅ copy selection HTML
  const copySelection = async () => {
    if (!editor) return;

    // select parent if inside a table
    // (optional: you can remove this line)
    // editor.chain().focus().selectParentNode().run();

    const html = editor.getHTML();
    await navigator.clipboard.writeText(html);
  };

  // ✅ Cut table = copy + delete
  const cutTable = async () => {
    if (!editor) return;

    // if cursor is inside table, selecting parent node will select table
    editor.chain().focus().selectParentNode().run();

    const isTable = editor.isActive("table");
    if (!isTable) {
      alert("Cursor is not inside a table.");
      return;
    }

    const html = editor.getHTML();
    await navigator.clipboard.writeText(html);

    editor.chain().focus().deleteSelection().run();
  };

  return (
    <Box
      sx={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 2.5,
        overflow: "hidden",
        bgcolor: "#fff",
      }}
    >
      {/* ✅ Toolbar */}
      <Box sx={{ p: 1, borderBottom: "1px solid rgba(0,0,0,0.08)", bgcolor: "grey.50" }}>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap alignItems="center">
          {/* Undo/Redo */}
          <Tooltip title="Undo">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().undo().run()}>
              <UndoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().redo().run()}>
              <RedoIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.8 }} />

          {/* Bold/Italic/Underline/Strike */}
          <Tooltip title="Bold">
            <IconButton
              size="small"
              sx={iconBtn(editor.isActive("bold"))}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Italic">
            <IconButton
              size="small"
              sx={iconBtn(editor.isActive("italic"))}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Underline">
            <IconButton
              size="small"
              sx={iconBtn(editor.isActive("underline"))}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Strike">
            <IconButton
              size="small"
              sx={iconBtn(editor.isActive("strike"))}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <StrikethroughSIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Highlight">
            <IconButton
              size="small"
              sx={iconBtn(editor.isActive("highlight"))}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              <HighlightIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.8 }} />

          {/* Lists */}
          <Tooltip title="Bullet List">
            <IconButton
              size="small"
              sx={iconBtn(editor.isActive("bulletList"))}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Ordered List">
            <IconButton
              size="small"
              sx={iconBtn(editor.isActive("orderedList"))}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <FormatListNumberedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.8 }} />

          {/* Quote / Code */}
          <Tooltip title="Blockquote">
            <IconButton
              size="small"
              sx={iconBtn(editor.isActive("blockquote"))}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <FormatQuoteIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Code block">
            <IconButton
              size="small"
              sx={iconBtn(editor.isActive("codeBlock"))}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <CodeIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.8 }} />

          {/* Align */}
          <Tooltip title="Align Left">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
              <FormatAlignLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align Center">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
              <FormatAlignCenterIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align Right">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
              <FormatAlignRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Justify">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
              <FormatAlignJustifyIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.8 }} />

          {/* Link */}
          <Tooltip title="Link">
            <IconButton size="small" sx={iconBtn(editor.isActive("link"))} onClick={setLink}>
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Unlink">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().unsetLink().run()}>
              <LinkOffIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.8 }} />

          {/* ✅ Insert Image */}
          <Tooltip title={uploading ? "Uploading..." : "Insert Image"}>
            <span>
              <IconButton
                size="small"
                sx={iconBtn()}
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                <ImageIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Delete selected image">
            <IconButton size="small" sx={iconBtn()} onClick={deleteSelectedImage}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <input ref={fileRef} type="file" hidden accept="image/*" onChange={onPickImage} />

          <Divider flexItem orientation="vertical" sx={{ mx: 0.8 }} />

          {/* ✅ Table */}
          <Tooltip title="Insert Table">
            <IconButton
              size="small"
              sx={iconBtn()}
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            >
              <TableChartIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Column">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().addColumnAfter().run()}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Row">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().addRowAfter().run()}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Column">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().deleteColumn().run()}>
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Row">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().deleteRow().run()}>
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Table">
            <IconButton size="small" sx={iconBtn()} onClick={() => editor.chain().focus().deleteTable().run()}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.8 }} />

          {/* ✅ Cut/Copy */}
          <Tooltip title="Cut Table (copies + removes)">
            <IconButton size="small" sx={iconBtn()} onClick={cutTable}>
              <ContentCutIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Copy HTML">
            <IconButton size="small" sx={iconBtn()} onClick={copySelection}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* ✅ Editor */}
      <Box
        sx={{
          p: 1.5,
          "& .ProseMirror": {
            outline: "none",
            minHeight,
            fontSize: 15.5,
            lineHeight: 1.85,
          },

          // ✅ images look good
          "& img": {
            maxWidth: "100%",
            borderRadius: 12,
            margin: "10px 0",
          },

          // ✅ tables look good
          "& table": {
            width: "100%",
            borderCollapse: "collapse",
            margin: "12px 0",
          },
          "& th, & td": {
            border: "1px solid rgba(0,0,0,0.15)",
            padding: "8px",
            verticalAlign: "top",
          },
          "& th": {
            fontWeight: 900,
            background: "rgba(0,0,0,0.04)",
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
