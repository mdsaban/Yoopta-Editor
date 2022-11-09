import { Transforms, Editor, Element as SlateElement } from 'slate';
import { v4 } from 'uuid';
import copy from 'copy-to-clipboard';
import { ReactEditor, useSlate } from 'slate-react';
import cx from 'classnames';
import { HoveredMenuItem } from './HoveredMenuItem';
import { VOID_ELEMENTS } from '../Editor/constants';
import { useNodeSettingsContext } from '../../contexts/NodeSettingsContext/NodeSettingsContext';
import s from './HoveredMenu.module.scss';

const ElementHover = ({
  children,
  element,
  attributes,
  onDragStart,
  onDragEnd,
  onDrop,
  dndState,
}) => {
  const editor = useSlate();
  const index = ReactEditor.findPath(editor, element)[0];
  const { onHover, onHoverOut, hoveredNodeId, onPlusButtonClick } = useNodeSettingsContext();

  const isDragging = index === dndState.from;
  const isOver = index === dndState.to;
  const isOverSelf = isDragging && isOver;

  const opacity = isDragging ? 0.4 : 1;
  const hovered = hoveredNodeId === element.id;

  const onMouseEnter = () => {
    onHover(element.id);
  };
  const onMouseLeave = () => onHoverOut();

  const handlePlusButton = () => onPlusButtonClick(element);

  const handleDeleteNode = () => {
    Transforms.removeNodes(editor, {
      at: editor.selection?.anchor,
      match: (node) => Editor.isEditor(editor) && SlateElement.isElement(node),
    });
  };

  const handleDuplicateNode = () => {
    const currentNode = Array.from(
      Editor.nodes(editor, {
        match: (node) => Editor.isEditor(editor) && SlateElement.isElement(node),
        at: editor.selection?.anchor,
      }),
    )[0]?.[0];

    if (currentNode) {
      const duplicatedNode = { ...currentNode, id: v4() };

      if (editor.selection) {
        Transforms.insertNodes(editor, duplicatedNode, {
          at: { offset: 0, path: [editor.selection.anchor.path[0], 0] },
          match: (node) => Editor.isEditor(editor) && SlateElement.isElement(node),
          select: true,
        });

        // Transforms.select(editor, [editor.selection!.anchor.path[0], editor.selection?.anchor.path[1]]);
        ReactEditor.focus(editor);
      }
    }
  };

  const handleCopyLinkNode = () => {
    copy(`${window.location.origin}#${element.id}`);
  };

  return (
    <section
      className={cx(s.hoverWrap, {
        [s.isOver]: isOver,
        [s.isOverSelf]: isOverSelf,
      })}
      data-node-id={element.id}
      data-node-type={element.type}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ opacity }}
      onDrop={onDrop}
      {...attributes}
    >
      <HoveredMenuItem
        handlePlusButton={handlePlusButton}
        hovered={hovered}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        isDragging={isDragging}
        handleDeleteNode={handleDeleteNode}
        handleDuplicateNode={handleDuplicateNode}
        handleCopyLinkNode={handleCopyLinkNode}
        elementId={element.id}
        isVoidElement={VOID_ELEMENTS.includes(element.type)}
      />
      <div className={s.content}>{children}</div>
    </section>
  );
};

export { ElementHover };
