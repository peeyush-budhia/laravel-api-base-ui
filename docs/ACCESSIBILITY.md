# Accessibility Review

The v1.0.0 review covers keyboard access, semantic controls, status
communication, form errors, and responsive layouts.

## Implemented controls

- Interactive controls use native buttons and links with explicit button types.
- Menus expose expanded state and menu relationships.
- Decorative images are hidden from assistive technology with empty alt text.
- Loading, error, and empty states use status or alert semantics.
- Form controls expose invalid state and describe field-level errors.
- Toast messages use an aria-live region and provide a keyboard-dismissible
  control.
- Pagination controls are disabled at their boundaries and remain keyboard
  reachable.

## Review requirements

Every new screen must have a visible keyboard focus state, a logical heading
hierarchy, labels associated with controls, and an accessible name for icon-only
buttons. Do not use click handlers on non-interactive elements for primary
actions. Verify keyboard-only navigation and a screen reader before release.

## Manual release checks

Test at 200% zoom and narrow viewport widths. Confirm focus is not trapped,
dialogs can be closed from the keyboard, validation errors are announced, and
content remains usable without color alone.
