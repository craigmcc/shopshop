// @/test/ActionUtils.ts

/**
 * Utilities supporting functional tests of {Action} classes.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/ErrorHelpers";
import { BaseUtils/*, OPTIONS*/ } from "@/test/BaseUtils";

// Public Objects -----------------------------------------------------------

export class ActionUtils extends BaseUtils {

  // Public Members --------------------------------------------------------

  /**
   * Look up and return the List from the database.
   *
   * @param name                        Name of the requested List
   *
   * @returns                           The requested List
   *
   * @throws NotFoundError              If no such List exists
   */
  public async lookupList(name: string): Promise<List> {
    const list = await db.list.findFirst({
      where: {
        name,
      },
    });
    if (!list) {
      throw new NotFoundError(`No LIst found for name ${name}`);
    }
    return list;
  }

  /**
   * Look up and return the Profile from the database.
   *
   * @param email                       Email address of the requested Profile
   *
   * @returns                           The requested Profile
   *
   * @throws NotFoundError              If no such Profile exists
   */
  public async lookupProfile(email: string): Promise<Profile> {
    const profile = await db.profile.findUnique({
      where: {
        email,
      },
    });
    if (!profile) {
      throw new NotFoundError(`No Profile found for email ${email}`);
    }
    return profile;
  }

}
