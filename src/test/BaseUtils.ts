// @/test/BaseUtils.ts

/**
 * Base utilities for functional tests.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { /*Category, Item,*/ List, Member, MemberRole, Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as SeedData from "@/test/SeedData";
import { db } from "@/lib/db";

// Public Objects ------------------------------------------------------------

// Options to choose which models should be populated
export type OPTIONS = {
  withCategories: boolean,
  withItems: boolean,
  withLists: boolean,
  withMembers: boolean,
  withProfiles: boolean,
}

/**
 * Base utilities for functional tests.
 */
export abstract class BaseUtils {

  /**
   * Erase current database, then load seed data for the models selected
   * in the options parameter.
   *
   * @param options                     Flags to select tables to be loaded
   */
  public async loadData(options: Partial<OPTIONS>) {

    // Delete all existing rows in all tables
    await db.category.deleteMany();
    await db.item.deleteMany();
    await db.list.deleteMany();
    await db.member.deleteMany();
    await db.profile.deleteMany();

    // Load Profiles if requested
    const profiles: Profile[] = [];
    if (options.withProfiles) {
      for (const profile of SeedData.PROFILES) {
        profiles.push(await db.profile.create({
          data: {
            email: profile.email!,
            name: profile.name!,
            password: profile.password!,
            scope: null, // TODO - eliminate
          }
        }));
      }
    }

    // Load Lists if requested
    const lists: List[] = [];
    if (options.withLists) {
      for (const list of SeedData.LISTS) {
        lists.push(await db.list.create({
          data: {
            name: list.name!,
          }
        }));
      }
      // TODO - Seed with initial Categories and Items for each List if requested
    }

    // Load Members if requested
    const members: Member[] = [];
    if (options.withProfiles && options.withLists && options.withMembers) {
      members.push(
        await db.member.create({
          data: {
            listId: lists[0].id,
            profileId: profiles[0].id,
            role: MemberRole.ADMIN,
          }
        })
      );
      members.push(
        await db.member.create({
          data: {
            listId: lists[1].id,
            profileId: profiles[0].id,
            role: MemberRole.GUEST,
          }
        })
      );
      members.push(
        await db.member.create({
          data: {
            listId: lists[1].id,
            profileId: profiles[1].id,
            role: MemberRole.ADMIN,
          }
        })
      );
      members.push(
        await db.member.create({
          data: {
            listId: lists[2].id,
            profileId: profiles[1].id,
            role: MemberRole.GUEST,
          }
        })
      );
      members.push(
        await db.member.create({
          data: {
            listId: lists[2].id,
            profileId: profiles[2].id,
            role: MemberRole.ADMIN,
          }
        })
      );
      members.push(
        await db.member.create({
          data: {
            listId: lists[1].id,
            profileId: profiles[2].id,
            role: MemberRole.GUEST,
          }
        })
      );

    }

    return { profiles, lists, members }; // TODO - categories and items?

  }

}

