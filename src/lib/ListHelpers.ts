// NOTE: *Not* a "use server" file to prevent methods from being server actions

// @/lib/ListHelpers

/**
 * Create the Category and Item models for a new List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { InitialListData } from "@/lib/InitialListData";
import { type CategorySchemaType } from "@/zod-schemas/CategorySchema";
import { type ItemSchemaType } from "@/zod-schemas/ItemSchema";

// Public Objects ------------------------------------------------------------

/**
 * Populate the Category and Item models for a new List.
 *
 * @param listId                        ID of the List to be populated
 * @param withCategories                Should we include Categories?
 * @param withItems                     Should we include Items?  (implies withCategories)
 */
export async function populateList(listId: string, withCategories: boolean, withItems: boolean): Promise<void> {

  // Create each defined Category, keeping them around for access to IDs
  const categories: Category[] = [];
  if (withCategories || withItems) {
    for (const element of InitialListData) {
      const category: CategorySchemaType = {
        listId: listId,
        name: element[0],
      }
      categories.push(await db.category.create({ data: category }));
    }
  }

  // For each created category, create the relevant Items
  if (withItems) {
    for (let i = 0; i < InitialListData.length; i++) {
      const element = InitialListData[i];
      if (element.length > 1) {
        for (let j = 1; j < element.length; j++) {
          const item: ItemSchemaType = {
            categoryId: categories[i].id,
            checked: false,
            listId: listId,
            name: element[j],
            selected: false,
          }
          await db.item.create({ data: item });
        }
      }
    }
  }

}
