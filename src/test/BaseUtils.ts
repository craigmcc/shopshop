// @/test/BaseUtils.ts

/**
 * Base utilities for Prisma-based functional tests.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Prisma, Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./SeedData";
import { db } from "@/lib/db";

// Public Objects ------------------------------------------------------------

export type OPTIONS = {
  withProfiles: boolean;
};

/**
 * Base utilities for functional tests.
 */
export abstract class BaseUtils {
  /**
   * Erase the current database, then load seed data for the tables
   * selected in the options parameter.
   *
   * @param options                     Flags used to select tables to be loaded
   */
  public async loadData(options: Partial<OPTIONS>): Promise<void> {
    await db.list.deleteMany({});
    await db.profile.deleteMany({});

    if (options.withProfiles) {
      /* const profiles = */ await loadProfiles(SeedData.PROFILES);
    }
  }
}

export default BaseUtils;

// Private Methods -----------------------------------------------------------

const loadProfiles = async (
  profiles: Prisma.ProfileUncheckedCreateInput[],
): Promise<Profile[]> => {
  let results: Profile[] = [];
  try {
    for (const profile of profiles) {
      results.push(await db.profile.create({ data: profile }));
    }
  } catch (error) {
    console.error("  Reloading Profiles ERROR", error);
    throw error;
  }
  return results;
};
