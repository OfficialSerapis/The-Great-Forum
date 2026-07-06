export interface RichTextEditorWithPreviewProps {
  documentId: string;
  content?: string;
  onChange?: (content: string) => void;
}
