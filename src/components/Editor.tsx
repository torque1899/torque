'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, LinkIcon, ImageIcon, AlignLeft, Undo, Redo, Code2
} from 'lucide-react';

const lowlight = createLowlight(common);

interface EditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export function Editor({ value = '', onChange, placeholder = 'Start writing your post…' }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Image.configure({ HTMLAttributes: { class: 'editor-image' } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextStyle,
      Color,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        spellcheck: 'true',
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = prompt('Image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = prompt('Link URL:', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--bg-card)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.125rem',
        padding: '0.625rem 0.75rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        flexWrap: 'wrap',
      }}>
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough size={15} /></ToolBtn>
        <Divider />
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={15} /></ToolBtn>
        <Divider />
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List"><ListOrdered size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote"><Quote size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code"><Code size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block"><Code2 size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Divider"><Minus size={15} /></ToolBtn>
        <Divider />
        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Link"><LinkIcon size={15} /></ToolBtn>
        <ToolBtn onClick={addImage} active={false} title="Image"><ImageIcon size={15} /></ToolBtn>
        <Divider />
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo"><Undo size={15} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo"><Redo size={15} /></ToolBtn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      <style>{`
        .tiptap-editor {
          min-height: 400px;
          padding: 1.5rem;
          outline: none;
          font-family: 'Merriweather', Georgia, serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text);
        }
        .tiptap-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--text-light);
          pointer-events: none;
          height: 0;
        }
        .tiptap-editor h1, .tiptap-editor h2, .tiptap-editor h3 {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        .tiptap-editor h1 { font-size: 1.875rem; }
        .tiptap-editor h2 { font-size: 1.5rem; }
        .tiptap-editor h3 { font-size: 1.25rem; }
        .tiptap-editor p { margin-bottom: 1rem; }
        .tiptap-editor ul, .tiptap-editor ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .tiptap-editor li { margin-bottom: 0.25rem; }
        .tiptap-editor blockquote {
          border-left: 4px solid var(--accent);
          padding: 0.5rem 1rem;
          margin: 1rem 0;
          background: var(--accent-bg);
          border-radius: 0 8px 8px 0;
          color: var(--text-muted);
          font-style: italic;
        }
        .tiptap-editor code {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 0.1rem 0.3rem;
          font-size: 0.875em;
          font-family: 'Fira Code', monospace;
        }
        .tiptap-editor pre {
          background: #1e1e2e;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .tiptap-editor pre code {
          background: none;
          border: none;
          padding: 0;
          color: #cdd6f4;
          font-size: 0.9rem;
        }
        .tiptap-editor a { color: var(--accent); text-decoration: underline; }
        .tiptap-editor img { max-width: 100%; border-radius: 10px; margin: 1rem 0; height: auto; }
        .tiptap-editor hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
      `}</style>
    </div>
  );
}

interface ToolBtnProps {
  onClick: () => void;
  active: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolBtn = ({ onClick, active, title, children }: ToolBtnProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    style={{
      width: 32, height: 32,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 6,
      border: 'none',
      background: active ? 'var(--accent)' : 'transparent',
      color: active ? 'white' : 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      flexShrink: 0,
    }}
  >
    {children}
  </button>
);

const Divider = () => <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 0.25rem' }} />;
