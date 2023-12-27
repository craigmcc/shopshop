// @/test/ActionUtils.ts

/**
 * Utilities suporting functional tests of {Model}Actions modules.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import { BaseUtils, OPTIONS } from "./BaseUtils";

// Public Objects ------------------------------------------------------------

export class ActionUtils extends BaseUtils {
  /**
   * Placeholder in case we need to add some additional logic specific
   * to action related tests.
   *
   * @param options                     Flags used to select tables to be loaded
   */
  public async loadData(options: Partial<OPTIONS>): Promise<void> {
    await super.loadData(options);
  }
}
