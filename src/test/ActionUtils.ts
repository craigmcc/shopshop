// @/test/ActionUtils.ts

/**
 * Utilities supporting functional tests of {Action} classes.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Category, Item, List, MemberRole, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/ErrorHelpers";
import { BaseUtils/*, OPTIONS*/ } from "@/test/BaseUtils";

// Public Objects -----------------------------------------------------------

export class ActionUtils extends BaseUtils {

  // Public Members --------------------------------------------------------

  /**
   * Look up and return the Category from the database that is associated
   * with the specified List, by name.
   *
   * @param name                        Name of the Category that is requested
   * @param list                        List for which the Category is requested
   */
  public async lookupCategory(name: string, list: List): Promise<Category> {
    const category = await db.category.findFirst({
      where: {
        listId: list.id,
        name,
      },
    });
    if (!category) {
      throw new NotFoundError(`No Category found for name '${name}'`);
    }
    return category;
  }

  /**
   * Look up and return the Item from the database that is associated
   * with the specified Category, by name.
   *
   * @param name                        Name of the Item that is requested
   * @param category                    Category for which the Item is requested
   */
  public async lookupItem(name: string, category: Category): Promise<Item> {
    const item = await db.item.findFirst({
      where: {
        categoryId: category.id,
        name,
      },
    });
    if (!item) {
      throw new NotFoundError(`No Item found for name '${name}' in Category '${category.name}'`);
    }
    return item;
  }

  /**
   * Look up and return a List from the database constrained by membership.
   *
   * @param name                        Name of the requested List
   * @param profile                     Profile that must be a Member of the List
   * @param role                        Role that the Profile must have in the List
   *
   * @returns                           The requested List
   *
   * @throws NotFoundError              If no such List exists
   */
  public async lookupList(name: string, profile: Profile, role: MemberRole): Promise<List> {
    const list = await db.list.findFirst({
      where: {
        name,
        members: {
          some: {
            profileId: profile.id,
            role,
          },
        },
      },
    });
    if (!list) {
      throw new NotFoundError(`No List found for name '${name}' with role '${role}' for Profile '${profile.email}'`);
    }
    return list;
  }

  /**
   * Look up and return the List from the database.
   *
   * @param name                        Name of the requested List
   *
   * @returns                           The requested List
   *
   * @throws NotFoundError              If no such List exists
   */
  public async lookupListByName(name: string): Promise<List> {
    const list = await db.list.findFirst({
      where: {
        name,
      },
    });
    if (!list) {
      throw new NotFoundError(`No List found for name '${name}'`);
    }
    return list;
  }

  /**
   * Look up and return the first List for which the specified Profile is a Member
   * with the specified Role (or not a Member if role is null).
   *
   * @param profile                     Profile that must be an ADMIN Member of the List
   * @param role                        Role that the Profile must have in the List (or null)
   *
   * @returns                           The requested List (if any), or null
   */
  public async lookupListByRole(profile: Profile, role: MemberRole | null): Promise<List | null> {
    if (role) {
      return await db.list.findFirst({
        where: {
          members: {
            some: {
              profileId: profile.id,
              role,
            },
          },
        },
      });
    } else {
      return await db.list.findFirst({
        where: {
          members: {
            none: {
              profileId: profile.id,
            },
          },
        },
      });
    }
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
