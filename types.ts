export interface FormattingOptions {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textIndent?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  border?: {
    style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
    width?: number;
    color?: string;
    radius?: number;
  };
}

export interface RichTextEditorWithPreviewProps {
  documentId: string;
  content?: string;
  onChange?: (content: string) => void;
}
