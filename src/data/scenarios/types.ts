/**
 * Types for scenario data files (one per standard initially; K.OA.A.1 first).
 *
 * Each scenario ships with 3 story templates. Each template has blanks the
 * Builder fills via dropdowns or small number inputs. The blank's `kind`
 * controls which UI control renders.
 */

export type BlankKind = "number" | "dropdown"

export interface NumberBlank {
  id: string
  kind: "number"
  min: number
  max: number
}

export interface DropdownBlank {
  id: string
  kind: "dropdown"
  options: string[]
}

export type StoryBlank = NumberBlank | DropdownBlank

export type Operation = "+" | "-"

export interface StoryTemplate {
  id: string
  /**
   * Renderable template with `{blankId}` tokens. Example:
   *   "{character} has {n1} pennies. They {verbPhrase} {n2} more pennies. How many pennies are in the jar now?"
   */
  template: string
  /**
   * Order matters — drives UI field order in the mad-lib editor.
   */
  blanks: StoryBlank[]
  /**
   * The operation this template implies. Drives Step 3 pre-fill.
   * Inferred from the template's verb-phrase list; stored explicitly here for
   * runtime simplicity (no parsing required).
   */
  operation: Operation
}

export interface Scenario {
  id: string
  title: string
  description: string
  emoji: string
  /**
   * Path to a Leonardo-generated illustration (relative to /public).
   * `null` means use the emoji as the icon for now.
   */
  illustrationAsset: string | null
  templates: StoryTemplate[]
}
