/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import {
  ContextMenu,
  ContextMenuComponents,
  Icons,
} from '@googleforcreators/design-system';
import { useRef, useState } from '@googleforcreators/react';
import { useFeature } from 'flagged';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  RIGHT_CLICK_MENU_LABELS,
  RIGHT_CLICK_MENU_SHORTCUTS,
} from '../constants';
import {
  useCopyPasteActions,
  useElementActions,
  useLayerActions,
  usePresetActions,
} from '../hooks';
import useLayerSelect from '../useLayerSelect';
import { LayerLock, LayerName, LayerUngroup } from '../items';
import { useConfig, useStory } from '../..';
import useRightClickMenu from '../useRightClickMenu';
import { DEFAULT_DISPLACEMENT, MenuPropType, SubMenuContainer } from './shared';

// Is there no 'ChevronLefSmall' icon? 🤔
const ChevronLeftSmall = styled(Icons.ChevronRightSmall)`
  transform: rotate(180deg);
`;

// This is used for positioning the submenus. The way any submenus
// are positioned elsewhere in the app depend on the main menu that
// contains the submenu. This is problematic when there is more than
// just one menu item at the top of the main menu with a submenu (as
// is the case with the 'Heading Level' submenu. Something to consider
// would be to refactor the menu/submenu components to include the
// 'outer' container (and 'trigger' button so the submenu can be positioned
// properly no matter where its parent menu item is located.
const SubMenuOuterContainer = styled.div`
  position: relative;
  width: 100%;
`;

function TextMenu({ parentMenuRef }) {
  // Feature flagging for Semantic Headings
  const showSemanticHeadings = useFeature('showSemanticHeadings');
  const { isRTL } = useConfig();
  const { copiedElementType, selectedElementType } = useStory(({ state }) => ({
    copiedElementType: state.copiedElementState.type,
    selectedElementType: state.selectedElements?.[0].type,
  }));
  const { handleCopyStyles, handlePasteStyles } = useCopyPasteActions();
  const { handleDuplicateSelectedElements } = useElementActions();
  const {
    canElementMoveBackwards,
    canElementMoveForwards,
    handleSendBackward,
    handleSendToBack,
    handleBringForward,
    handleBringToFront,
  } = useLayerActions();
  const { handleAddColorPreset, handleAddTextPreset } = usePresetActions();

  const layerSubMenuOuterRef = useRef();
  const layerSubMenuRef = useRef();

  const headingsSubMenuOuterRef = useRef();
  const headingsSubMenuRef = useRef();

  const { menuPosition, onCloseMenu } = useRightClickMenu();

  const layerSelectProps = useLayerSelect({
    menuPosition,
    isMenuOpen: true,
  });

  // Remap property names for use with ONLY layer menu
  const {
    openSubMenu: openLayerSubMenu,
    closeSubMenu: closeLayerSubMenu,
    isSubMenuOpen: isLayerSubMenuOpen,
    subMenuItems: layerSubMenuItems,
    ...layerSubMenuTriggerProps
  } = layerSelectProps || {};

  const [isHeadingsSubMenuOpen, setIsHeadingSubMenuOpen] = useState(false);

  // TODO: USE A *REAL* FUNCTION TO SET *AND SAVE* THE HEADING LEVEL
  const [headingLevel, setHeadingLevel] = useState('auto');

  // TODO: REPLACE WITH VALUES USED IN THE LEFT-HAND PANEL
  //       -----------------------------------------------
  const headingsSubMenuItems = [
    { label: 'Automatic', tagName: 'p', key: 'auto' },
    { label: 'Heading 1', tagName: 'h1' },
    { label: 'Heading 2', tagName: 'h2' },
    { label: 'Heading 3', tagName: 'h3' },
    { label: 'Paragraph', tagName: 'p' },
  ];

  return (
    <>
      {layerSelectProps && (
        <>
          <SubMenuOuterContainer ref={layerSubMenuOuterRef}>
            <ContextMenuComponents.SubMenuTrigger
              openSubMenu={openLayerSubMenu}
              closeSubMenu={closeLayerSubMenu}
              isSubMenuOpen={isLayerSubMenuOpen}
              parentMenuRef={parentMenuRef}
              subMenuRef={layerSubMenuRef}
              style={{ width: '100%' }}
              {...layerSubMenuTriggerProps}
            />
            <SubMenuContainer
              ref={layerSubMenuRef}
              className="submenu-container"
              position={{
                x:
                  (layerSubMenuOuterRef?.current?.offsetWidth ||
                    DEFAULT_DISPLACEMENT) + 4,
                y: -8,
              }}
            >
              <ContextMenu
                onDismiss={onCloseMenu}
                isOpen={isLayerSubMenuOpen}
                onCloseSubMenu={closeLayerSubMenu}
                aria-label={RIGHT_CLICK_MENU_LABELS.SELECT_LAYER}
                isSubMenu
                parentMenuRef={parentMenuRef}
              >
                {layerSubMenuItems.map(({ key, ...menuItemProps }) => (
                  <ContextMenuComponents.MenuItem
                    key={key}
                    {...menuItemProps}
                  />
                ))}
              </ContextMenu>
            </SubMenuContainer>
          </SubMenuOuterContainer>
          <ContextMenuComponents.MenuSeparator />
        </>
      )}

      <ContextMenuComponents.MenuButton
        onClick={handleDuplicateSelectedElements}
      >
        {RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(1)}
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuSeparator />

      <ContextMenuComponents.MenuButton
        disabled={!canElementMoveBackwards}
        onClick={handleSendBackward}
      >
        {RIGHT_CLICK_MENU_LABELS.SEND_BACKWARD}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.SEND_BACKWARD.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuButton
        disabled={!canElementMoveBackwards}
        onClick={handleSendToBack}
      >
        {RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.SEND_TO_BACK.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuButton
        disabled={!canElementMoveForwards}
        onClick={handleBringForward}
      >
        {RIGHT_CLICK_MENU_LABELS.BRING_FORWARD}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.BRING_FORWARD.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuButton
        disabled={!canElementMoveForwards}
        onClick={handleBringToFront}
      >
        {RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.BRING_TO_FRONT.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>

      <LayerName />
      <LayerLock />
      <LayerUngroup />

      <ContextMenuComponents.MenuSeparator />

      {showSemanticHeadings && (
        <>
          <SubMenuOuterContainer ref={headingsSubMenuOuterRef}>
            <ContextMenuComponents.SubMenuTrigger
              label={RIGHT_CLICK_MENU_LABELS.TEXT_HEADING_LEVEL}
              openSubMenu={() => setIsHeadingSubMenuOpen(true)}
              closeSubMenu={() => setIsHeadingSubMenuOpen(false)}
              isSubMenuOpen={isHeadingsSubMenuOpen}
              parentMenuRef={parentMenuRef}
              subMenuRef={headingsSubMenuRef}
              SuffixIcon={isRTL ? ChevronLeftSmall : Icons.ChevronRightSmall}
              title={`Heading Level - ${
                headingsSubMenuItems.find((item) => {
                  return [item.key, item.tagName].includes(headingLevel);
                }).label
              }`}
              style={{ width: '100%' }}
            />
            <SubMenuContainer
              ref={headingsSubMenuRef}
              className="submenu-container"
              position={{
                x:
                  (headingsSubMenuOuterRef?.current?.offsetWidth ||
                    DEFAULT_DISPLACEMENT) + 4,
                y: -8,
              }}
            >
              <ContextMenu
                onDismiss={onCloseMenu}
                isOpen={isHeadingsSubMenuOpen}
                onCloseSubMenu={() => setIsHeadingSubMenuOpen(false)}
                aria-label={RIGHT_CLICK_MENU_LABELS.TEXT_HEADING_LEVEL}
                isSubMenu
                parentMenuRef={parentMenuRef}
              >
                {headingsSubMenuItems.map(({ label, tagName, key }) => (
                  <ContextMenuComponents.MenuButton
                    key={key ?? tagName}
                    onClick={() => {
                      // TODO: HANDLE HEADING LEVEL CHANGE HERE
                      setHeadingLevel(key ?? tagName);
                    }}
                  >
                    {label}
                  </ContextMenuComponents.MenuButton>
                ))}
              </ContextMenu>
            </SubMenuContainer>
          </SubMenuOuterContainer>

          <ContextMenuComponents.MenuSeparator />
        </>
      )}

      <ContextMenuComponents.MenuButton onClick={handleCopyStyles}>
        {RIGHT_CLICK_MENU_LABELS.COPY_STYLES}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuButton
        disabled={copiedElementType !== selectedElementType}
        onClick={handlePasteStyles}
      >
        {RIGHT_CLICK_MENU_LABELS.PASTE_STYLES}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuButton onClick={handleAddTextPreset}>
        {RIGHT_CLICK_MENU_LABELS.ADD_TO_TEXT_PRESETS}
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuButton onClick={handleAddColorPreset}>
        {RIGHT_CLICK_MENU_LABELS.ADD_TO_COLOR_PRESETS}
      </ContextMenuComponents.MenuButton>
    </>
  );
}
TextMenu.propTypes = MenuPropType;

export default TextMenu;
