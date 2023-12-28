// @/test/BaseUtils.ts

/**
 * Base utilities for Prisma-based functional tests.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, Member, MemberRole, Prisma, Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./SeedData";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/encryption";

// Public Objects ------------------------------------------------------------

export type OPTIONS = {
  withLists: boolean;
  withMembers: boolean;
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
    await db.member.deleteMany({});
    await db.profile.deleteMany({});

    if (options.withProfiles) {
      const profiles = await loadProfiles(SeedData.PROFILES);
      if (options.withLists) {
        const lists: List[] = [];
        lists.push(await loadList(profiles[0].id, SeedData.LISTS[0]));
        lists.push(await loadList(profiles[1].id, SeedData.LISTS[1]));
        lists.push(await loadList(profiles[2].id, SeedData.LISTS[2]));
        if (options.withMembers) {
          const members: Member[] = [];
          members.push(
            await loadMember(profiles[0].id, lists[0].id, MemberRole.ADMIN),
          );
          members.push(
            await loadMember(profiles[0].id, lists[1].id, MemberRole.GUEST),
          );
          members.push(
            await loadMember(profiles[1].id, lists[1].id, MemberRole.ADMIN),
          );
          members.push(
            await loadMember(profiles[1].id, lists[2].id, MemberRole.GUEST),
          );
          members.push(
            await loadMember(profiles[2].id, lists[2].id, MemberRole.ADMIN),
          );
          members.push(
            await loadMember(profiles[2].id, lists[0].id, MemberRole.GUEST),
          );
        }
      }
    }
  }
}

export default BaseUtils;

// Private Methods -----------------------------------------------------------

const hashedPassword = async (
  password: string | undefined,
): Promise<string> => {
  return hashPassword(password ? password : "");
};

const loadList = async (
  profileId: string,
  list: Prisma.ListUncheckedCreateInput,
): Promise<List> => {
  const data = {
    ...list,
    profileId,
  };
  return await db.list.create({ data });
};

const loadMember = async (
  profileId: string,
  listId: string,
  role: MemberRole,
): Promise<Member> => {
  return await db.member.create({ data: { profileId, listId, role } });
};

const loadProfiles = async (
  profiles: Prisma.ProfileUncheckedCreateInput[],
): Promise<Profile[]> => {
  let results: Profile[] = [];
  try {
    for (const profile of profiles) {
      const data = {
        ...profile,
        password: await hashedPassword(profile.password),
      };
      results.push(await db.profile.create({ data }));
    }
  } catch (error) {
    console.error("  Reloading Profiles ERROR", error);
    throw error;
  }
  return results;
};
