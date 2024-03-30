import { getRootBlockElement, YooptaBlock } from '@yoopta/editor';
import { ActionMenuRenderProps, ActionMenuToolItem } from '../types';
import { DEFAULT_ICONS_MAP } from './icons';

function filterToggleActions(block: YooptaBlock) {
  if (!block) return false;

  const rootBlock = getRootBlockElement(block.elements);
  if (rootBlock?.props?.nodeType === 'void') return false;
  return true;
}

const DefaultActionMenuRender = ({
  actions: actionsProps,
  editor,
  onMouseEnter,
  selectedAction,
  onClose,
  empty,
  mode = 'create',
  view = 'default',
}: ActionMenuRenderProps) => {
  const isModeToggle = mode === 'toggle';
  const isViewSmall = view === 'small';

  const getActions = (): ActionMenuToolItem[] => {
    const items = actionsProps.map((action) => {
      if (typeof action === 'string') {
        const title = editor.blocks[action].options?.display?.title || action;
        const description = editor.blocks[action].options?.display?.description;
        return { type: action, title, description };
      }
      return action;
    });

    if (isModeToggle) return items.filter((action) => filterToggleActions(editor.blocks[action?.type]));
    return items;
  };

  const actions = getActions();

  const wrapStyles = {
    maxWidth: isViewSmall ? '200px' : '270px',
  };

  const iconWrapStyles = {
    minWidth: isViewSmall ? '28px' : '40px',
    width: isViewSmall ? '28px' : '40px',
    height: isViewSmall ? '28px' : '40px',
  };

  const iconStyles = {
    transform: isViewSmall ? 'scale(0.75)' : 'scale(1)',
  };

  return (
    <div
      style={wrapStyles}
      className="yoo-action-menu-bg-white yoo-action-menu-z-50 yoo-action-menu-h-auto yoo-action-menu-max-h-[330px] yoo-action-menu-w-72 yoo-action-menu-overflow-y-auto yoo-action-menu-rounded-md yoo-action-menu-border yoo-action-menu-border-muted yoo-action-menu-bg-background yoo-action-menu-px-1 yoo-action-menu-py-2 yoo-action-menu-transition-all yoo-action-menu-shadow-md"
    >
      <div className="yoo-action-menu-max-h-[300px] yoo-action-menu-overflow-y-auto yoo-action-menu-overflow-x-hidden">
        <div
          data-action-menu-list
          className="yoo-action-menu-overflow-hidden yoo-action-menu-p-0 yoo-action-menu-text-foreground"
        >
          {empty && (
            <div className="yoo-action-menu-text-left yoo-action-menu-text-muted-foreground yoo-action-menu-text-xs yoo-action-menu-px-1 yoo-action-menu-py-1">
              No actions available
            </div>
          )}
          {actions.map((action, i) => {
            const block = editor.blocks[action.type];
            const Icon = action.icon || DEFAULT_ICONS_MAP[action.type];

            if (!block) return null;

            const title = block.options?.display?.title || block.type;
            const description = block.options?.display?.description || '';

            return (
              <button
                key={action.type}
                onMouseEnter={onMouseEnter}
                // [TODO] - here is bug
                aria-selected={action.type === selectedAction?.type}
                data-action-menu-item
                data-action-menu-item-type={action.type}
                onClick={() => {
                  if (isModeToggle) {
                    editor.blocks[action.type].toggle(action.type, { focus: true });
                  } else {
                    editor.blocks[action.type].create({ deleteText: true, focus: true });
                  }

                  onClose();
                }}
                className="yoo-action-menu-flex yoo-action-menu-w-full yoo-action-menu-cursor-pointer yoo-action-menu-items-center yoo-action-menu-space-x-2 yoo-action-menu-rounded-md yoo-action-menu-px-1 yoo-action-menu-py-1 yoo-action-menu-mb-0.5 last:yoo-action-menu-mb-0 yoo-action-menu-text-left yoo-action-menu-text-sm hover:yoo-action-menu-bg-[#f4f4f5] aria-selected:yoo-action-menu-bg-[#f0f0f0]"
              >
                <div
                  style={iconWrapStyles}
                  className="yoo-action-menu-flex yoo-action-menu-h-[40px] yoo-action-menu-w-[40px] yoo-action-menu-items-center yoo-action-menu-justify-center yoo-action-menu-rounded-md yoo-action-menu-border yoo-action-menu-border-muted yoo-action-menu-bg-white"
                >
                  {Icon && <Icon style={iconStyles} />}
                </div>
                <div>
                  <div className="yoo-action-menu-font-medium">{title}</div>
                  {!isViewSmall && (
                    <div className="yoo-action-menu-text-xs yoo-action-menu-text-muted-foreground yoo-action-menu-truncate yoo-action-menu-text-ellipsis yoo-action-menu-max-w-[200px]">
                      {description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { DefaultActionMenuRender };
