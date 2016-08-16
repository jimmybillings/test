
import { MdAnchor, MdButton } from '@angular2-material/button';
import { MD_BUTTON_TOGGLE_DIRECTIVES, MdButtonToggle } from '@angular2-material/button-toggle';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MD_MENU_DIRECTIVES, MdMenu } from '@angular2-material/menu';
import { MdProgressBar } from '@angular2-material/progress-bar';
import { MdProgressCircle, MdSpinner } from '@angular2-material/progress-circle';
import { MdRadioButton, MdRadioGroup } from '@angular2-material/radio';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { MdSlideToggle } from '@angular2-material/slide-toggle';
import { MdTabGroup, MD_TABS_DIRECTIVES, TABS_INTERNAL_DIRECTIVES } from '@angular2-material/tabs';
import { MdToolbar } from '@angular2-material/toolbar';
import { MD_SLIDER_DIRECTIVES, MdSlider } from '@angular2-material/slider';
import { MdIcon, MdIconRegistry} from '@angular2-material/icon';
import { MdTooltip, MD_TOOLTIP_DIRECTIVES} from '@angular2-material/tooltip';
import { MdUniqueSelectionDispatcher} from '@angular2-material/core';
import { MD_GRID_LIST_DIRECTIVES, MdGridList} from '@angular2-material/grid-list';
import { MD_RIPPLE_DIRECTIVES, PORTAL_DIRECTIVES} from '@angular2-material/core';
// import { OverlayContainer } from '@angular2-material/core/overlay/overlay-container';
/*
 * we are grouping the module so we only need to manage the imports in one location
 */

// export const MATERIAL_PIPES = [

// ];

export const MATERIAL_DIRECTIVES = [
  ...MD_SIDENAV_DIRECTIVES,
  ...[
    MdAnchor,
    MdButton,
    MdButtonToggle,
    MdToolbar,
    MdCheckbox,
    MdRadioButton,
    MdRadioGroup,
    MdSpinner,
    MdMenu,
    MdProgressBar,
    MdProgressCircle,
    MdIcon,
    MdTabGroup,
    MdSlideToggle,
    MdGridList,
    MdSlider,
    MdTooltip
  ],
  ...MD_INPUT_DIRECTIVES,
  ...MD_LIST_DIRECTIVES,
  ...MD_CARD_DIRECTIVES,
  ...MD_TABS_DIRECTIVES,
  ...MD_GRID_LIST_DIRECTIVES,
  ...MD_BUTTON_TOGGLE_DIRECTIVES,
  ...MD_MENU_DIRECTIVES,
  ...MD_SLIDER_DIRECTIVES,
  ...MD_TOOLTIP_DIRECTIVES,
  ...MD_RIPPLE_DIRECTIVES,
  ...PORTAL_DIRECTIVES,
  ...TABS_INTERNAL_DIRECTIVES
];

export const MATERIAL_PROVIDERS = [
  MdIconRegistry,
  MdUniqueSelectionDispatcher
];

